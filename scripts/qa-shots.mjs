#!/usr/bin/env node
/**
 * Full-page screenshots of every route at phone and desktop widths, with console-error
 * and horizontal-overflow checks. Usage:
 *   node scripts/qa-shots.mjs [baseUrl=http://localhost:3000] [outDir=qa-report/shots]
 * Requires the `playwright` dev dependency; uses the Chromium under PLAYWRIGHT_BROWSERS_PATH.
 */
import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "qa-report/shots";
mkdirSync(out, { recursive: true });

const routes = [
  "/",
  "/services",
  "/services/water-damage-restoration",
  "/services/mold-remediation",
  "/service-areas",
  "/service-areas/queens",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/this-page-does-not-exist",
];

const viewports = [
  { name: "mobile", context: { ...devices["iPhone 14"] } },
  { name: "desktop", context: { viewport: { width: 1440, height: 900 } } },
];

const executablePath = process.env.MOBILE_QA_CHROMIUM || undefined;
const browser = await chromium.launch({ executablePath });
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext(vp.context);
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => {
      // The intentional 404 route logs the browser's own "Failed to load resource" line; ignore it.
      if (m.type() === "error" && !/status of 404/.test(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));
    const failed = [];
    page.on("requestfailed", (r) => failed.push(`${r.url()} ${r.failure()?.errorText ?? ""}`));
    const resp = await page.goto(base + route, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => null);
    await page.waitForTimeout(600);
    // Scroll through the page so scroll-triggered reveals fire, then back to top.
    const overflow = await page.evaluate(async () => {
      const hits = [];
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
        if (document.documentElement.scrollWidth > window.innerWidth + 1) hits.push(y);
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      return hits;
    });
    const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
    const file = join(out, `${name}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const topFile = join(out, `${name}-${vp.name}-top.png`);
    await page.screenshot({ path: topFile, fullPage: false });
    results.push({ route, viewport: vp.name, status: resp?.status() ?? null, errors, failed, overflowAt: overflow, file });
    console.log(`${vp.name.padEnd(7)} ${String(resp?.status() ?? "ERR").padEnd(4)} ${route.padEnd(36)} errors=${errors.length} failed=${failed.length} overflow=${overflow.length ? overflow.join(",") : "none"}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
writeFileSync(join(out, "results.json"), JSON.stringify(results, null, 2));
const bad = results.filter((r) => r.errors.length || r.overflowAt.length || (r.status && r.status >= 500));
console.log(bad.length ? `\n${bad.length} route/viewport combos need attention` : "\nAll routes clean: no console errors, no horizontal overflow.");
process.exit(bad.length ? 1 : 0);
