#!/usr/bin/env node
/**
 * Smoke test for POST /api/contact against a RUNNING server.
 *
 *   PORT=3000 node scripts/smoke-contact.mjs      (or: npm run smoke:contact)
 *
 * Sends: a GET (405), a non-JSON body (415), a JSON body with a charset
 * parameter (accepted past the type gate), a cross-site submission (403), an
 * oversized body with and without Content-Length (413), a valid lead (200),
 * an invalid lead (400 with field errors), a honeypot lead (silent 200), a
 * too-fast lead (silent 200) and six rapid leads (the burst limit is 5 per
 * 10 minutes per IP, so 429s with Retry-After are expected).
 *
 * The response for a real lead is deliberately identical to the bot one
 * ({ ok: true }); delivery status is only visible in the server log.
 *
 * The valid lead is a real submission: if an email provider is configured it
 * WILL email the office. It is clearly labelled "Smoke test".
 *
 * The rate limiter is in-memory; run this against a freshly started server or
 * the first requests will already be 429.
 */

const PORT = process.env.PORT || 3000;
const BASE = process.env.SMOKE_BASE_URL || `http://localhost:${PORT}`;
const URL_ = `${BASE}/api/contact`;

let failures = 0;

function pass(label, detail = "") {
  console.log(`  ok    ${label}${detail ? `  (${detail})` : ""}`);
}

function fail(label, detail = "") {
  failures += 1;
  console.log(`  FAIL  ${label}${detail ? `  (${detail})` : ""}`);
}

function expect(condition, label, detail) {
  if (condition) pass(label, detail);
  else fail(label, detail);
}

function validLead(overrides = {}) {
  return {
    name: "Smoke Test",
    phone: "(516) 555-0100",
    email: "smoke-test@example.com",
    address: "1 Main St, Massapequa, NY",
    service: "water-damage-restoration",
    urgency: "quote",
    message: "Automated smoke test from scripts/smoke-contact.mjs. Safe to ignore.",
    consent: true,
    website: "",
    startedAt: Date.now() - 15_000,
    ...overrides,
  };
}

async function post(body, init = {}) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON reply
  }
  return { status: res.status, headers: res.headers, json };
}

async function main() {
  console.log(`Smoke-testing ${URL_}\n`);

  try {
    await fetch(BASE, { method: "HEAD" });
  } catch (error) {
    console.error(`Cannot reach ${BASE}: ${error.message}\nStart the server first (npm run dev / npm start).`);
    process.exit(1);
  }

  // 1. GET is not allowed and advertises POST.
  {
    const res = await fetch(URL_);
    expect(res.status === 405, "GET -> 405", `status ${res.status}`);
    expect((res.headers.get("allow") || "").toUpperCase().includes("POST"), "GET -> Allow: POST", res.headers.get("allow") || "missing");
    expect((res.headers.get("cache-control") || "").includes("no-store"), "GET -> Cache-Control: no-store");
  }

  // 2. Content type must be exactly application/json (parameters allowed).
  {
    const res = await fetch(URL_, { method: "POST", headers: { "Content-Type": "text/plain" }, body: "hello" });
    expect(res.status === 415, "text/plain body -> 415", `status ${res.status}`);

    const loose = await fetch(URL_, { method: "POST", headers: { "Content-Type": "text/json" }, body: "{}" });
    expect(loose.status === 415, "text/json body -> 415", `status ${loose.status}`);

    // Malformed JSON with a charset parameter: must get past the 415 gate (-> 400).
    const charset = await post("{not json", { headers: { "Content-Type": "application/json; charset=utf-8" } });
    expect(charset.status === 400, "application/json; charset=utf-8 -> passes type gate (400 for bad JSON)", `status ${charset.status}`);
  }

  // 2b. Cross-site browser submission (Sec-Fetch-Site) is refused before rate limiting.
  {
    const { status, json } = await post(validLead(), { headers: { "Sec-Fetch-Site": "cross-site" } });
    expect(status === 403 && json?.ok === false, "sec-fetch-site: cross-site -> 403", `status ${status}`);
    const same = await post("{not json", { headers: { "Sec-Fetch-Site": "same-origin" } });
    expect(same.status === 400, "sec-fetch-site: same-origin -> allowed through (400 for bad JSON)", `status ${same.status}`);
  }

  // 3. Oversized body (12 KB message), with Content-Length.
  {
    const big = validLead({ message: "x".repeat(12 * 1024) });
    const { status } = await post(big);
    expect(status === 413, "12KB body -> 413", `status ${status}`);
  }

  // 3b. Same body streamed chunked (no Content-Length): the route must stop
  //     reading at 10 KB. Dropping the connection early is an equally valid refusal.
  {
    const payload = new TextEncoder().encode(JSON.stringify(validLead({ message: "x".repeat(12 * 1024) })));
    const stream = new ReadableStream({
      start(controller) {
        for (let i = 0; i < payload.length; i += 1024) controller.enqueue(payload.slice(i, i + 1024));
        controller.close();
      },
    });
    try {
      const res = await fetch(URL_, { method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half" });
      expect(res.status === 413, "12KB chunked body -> 413", `status ${res.status}`);
    } catch (error) {
      pass("12KB chunked body -> connection closed by server", error.cause?.code || error.message);
    }
  }

  // 4. Malformed JSON.
  {
    const { status } = await post("{not json");
    expect(status === 400, "malformed JSON -> 400", `status ${status}`);
  }

  // 5. Valid lead.
  {
    const { status, json, headers } = await post(validLead());
    if (status === 429) {
      fail("valid lead -> 200", "already rate limited: restart the server or wait 10 minutes");
    } else {
      expect(status === 200 && json?.ok === true, "valid lead -> 200 ok:true", `status ${status}`);
      expect(JSON.stringify(json) === JSON.stringify({ ok: true }), "valid lead -> body is exactly {ok:true} (no delivery status leaked)", JSON.stringify(json));
      expect((headers.get("cache-control") || "").includes("no-store"), "valid lead -> Cache-Control: no-store");
    }
  }

  // 6. Invalid lead: short name, bad phone, bad email, no consent, short message.
  {
    const bad = validLead({ name: "A", phone: "123", email: "nope", consent: false, message: "short", service: "" });
    const { status, json } = await post(bad);
    const keys = Object.keys(json?.errors || {});
    expect(status === 400 && json?.ok === false, "invalid lead -> 400 ok:false", `status ${status}`);
    for (const k of ["name", "phone", "email", "consent", "message", "service"]) {
      expect(keys.includes(k), `invalid lead -> errors.${k} present`, json?.errors?.[k]?.[0] || "missing");
    }
  }

  // 7. Honeypot filled: must look like success.
  {
    const { status, json } = await post(validLead({ website: "https://spam.example" }));
    expect(status === 200 && json?.ok === true, "honeypot -> silent 200 ok:true", `status ${status}`);
  }

  // 8. Submitted instantly: must look like success.
  {
    const { status, json } = await post(validLead({ startedAt: Date.now() }));
    expect(status === 200 && json?.ok === true, "too-fast -> silent 200 ok:true", `status ${status}`);
  }

  // 9. Six rapid requests. Four have already counted (5-8), so 429s are expected here.
  {
    const results = [];
    for (let i = 0; i < 6; i += 1) {
      const { status, headers } = await post(validLead({ message: `Rapid-fire smoke test ${i + 1} of 6. Safe to ignore.` }));
      results.push({ status, retryAfter: headers.get("retry-after") });
    }
    const codes = results.map((r) => r.status);
    console.log(`  rapid statuses: ${codes.join(" ")}`);
    const limited = results.filter((r) => r.status === 429);
    expect(limited.length >= 1, "rapid x6 -> at least one 429", `${limited.length} limited`);
    expect(limited.every((r) => Number(r.retryAfter) > 0), "every 429 carries Retry-After > 0", limited.map((r) => r.retryAfter).join(",") || "none");
    expect(codes.every((c) => c === 200 || c === 429), "rapid x6 -> only 200 or 429", codes.join(" "));
  }

  console.log("");
  if (failures > 0) {
    console.log(`${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((error) => {
  console.error("Smoke test crashed:", error);
  process.exit(1);
});
