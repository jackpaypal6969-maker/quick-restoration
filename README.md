# Quick Restoration — website

24/7 emergency property damage restoration on Long Island: Nassau County,
Suffolk County and Queens. IICRC Certified Firm. NY State licensed mold
remediation contractor. Direct insurance billing.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind
CSS v4 and Motion. No third-party scripts, no external fonts at runtime, no
analytics, no cookies beyond what Next needs.

## Before the client sees it

Every business fact lives in **`src/config/site.ts`**. Search that file for
`TODO` and replace:

| Field | Currently | Replace with |
|---|---|---|
| `siteConfig.phone` | `(631) 555-0199` (placeholder) | the real 24/7 line |
| `siteConfig.email` | `help@quickrestorationny.com` | real inbox |
| `siteConfig.url` / `NEXT_PUBLIC_SITE_URL` | `quickrestorationny.com` | final domain |
| `siteConfig.legalName` | `Quick Restoration LLC` | legal entity |
| `credentials[nys-mold].detail` | `License #MRC-00000` | real NYS DOL mold license number |
| `siteConfig.founded` | 2015 | real year (or remove uses) |
| `siteConfig.social.*` | empty (icons hidden) | real profile URLs |
| `testimonials.sample` | `true` (shows a "sample reviews" note) | `false` once real reviews are pasted in |
| `public/images/*` | AI-generated placeholder photos | the client's real crew / truck / job photos |

Everything else (services, towns, FAQ, process copy) is real, specific copy
that the client can edit in the same file.

## Run locally

```bash
npm install
cp .env.example .env.local     # optional; the form logs to data/leads.jsonl without email creds
npm run dev                    # http://localhost:3000
npm run check                  # typecheck + lint
npm run build && npm start     # production build
npm run qa:shots               # full-page screenshots of every route at phone + desktop,
                               # console-error and horizontal-overflow checks (needs a running server)
npm run smoke:contact          # 24-case contact API check against a running server
```

## Contact form and leads

`POST /api/contact` validates with Zod, rate-limits per IP (5 per 10 min, 20
per day, plus an Nginx limit), drops honeypot / too-fast submissions silently,
appends every real lead to `data/leads.jsonl` and emails it through **one** of:

- `RESEND_API_KEY` (recommended; verify the sending domain in Resend), or
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` (Google Workspace, M365, SES…)

`CONTACT_TO_EMAIL` receives the lead; `CONTACT_FROM_EMAIL` must be a verified
sender. Without either provider the lead is still saved to the JSONL file and
a warning is logged. `npm run smoke:contact` exercises the endpoint against a
running server.

**Lead data retention.** `data/leads.jsonl` contains personal data (name,
phone, address, email, IP address). Agree a retention period with the client
and rotate or delete the file accordingly.

## Deploy to the VPS

One command, run as root on the box. It installs Node 22 / PM2 (and Nginx in
domain mode) if missing, clones this repo, builds, starts a PM2 app named
`quick-restoration`, and installs a 5-minute auto-update so every push to
`main` goes live by itself. It never touches other sites on the server.

**Preview on a bare port** (no domain; reachable at `http://SERVER_IP:PORT`,
first free port from 3010 upward, or set `PORT=`):

```bash
curl -fsSL https://raw.githubusercontent.com/jackpaypal6969-maker/quick-restoration/main/deploy/setup-vps.sh -o setup-vps.sh && bash setup-vps.sh --preview --auto-update
```

**Real domain** (also writes the Nginx site and issues the certificate):

```bash
curl -fsSL https://raw.githubusercontent.com/jackpaypal6969-maker/quick-restoration/main/deploy/setup-vps.sh -o setup-vps.sh && CERTBOT_EMAIL=you@example.com bash setup-vps.sh quick.yourdomain.com --auto-update
```

Then put email credentials in `.env.production` (in
`/var/www/quick-restoration-src`) and `pm2 restart quick-restoration`.
Auto-update log: `/var/log/quick-restoration-update.log`; turn it off with
`rm -f /etc/cron.d/quick-restoration`. Manual update: same command with
`--update` instead of `--auto-update`.

Files: `deploy/setup-vps.sh`, `deploy/ecosystem.config.cjs`,
`deploy/nginx.conf.template`, `deploy/transfer-to-client.md`.

## Structure

```
src/app/                 routes (App Router): /, /services, /services/[slug],
                         /service-areas, /service-areas/[slug], /about, /contact,
                         /privacy, /terms, /api/contact, sitemap, robots, manifest, OG image
src/components/layout/   Header (transparent → glass on scroll), mobile menu, Footer, MobileCallBar
src/components/sections/ home-page sections + PageHero used by every inner page
src/components/map/      Long Island county map (real census geometry in src/data/long-island-map.ts)
src/components/forms/    ContactForm
src/components/ui/       Button, Container, SectionHeading, Eyebrow, Reveal, Accordion
src/config/site.ts       ALL business data and copy
src/lib/                 utils, contact schema, mail, rate limit, leads log, seo helpers
src/app/globals.css      design tokens (Tailwind v4 @theme): midnight / royal / electric / ice / ink
```

## What was verified before handoff

- Production build, strict TypeScript and ESLint: clean.
- Every route at 390px (iPhone 14) and 1440px: no console errors, no horizontal overflow.
- Reduce Motion enabled: no content left hidden (the server-render / hydration mismatch that
  motion's `useReducedMotion` causes is avoided with an SSR-safe hook).
- Contact API: validation, honeypot, timing, rate limiting, body cap, content-type and
  cross-site checks all exercised (`npm run smoke:contact`); a real browser submission
  produced a confirmation and a line in `data/leads.jsonl`.
- Security headers present on every response; social preview tags on every page.

## Security notes

- Strict security headers in `next.config.ts` (CSP, HSTS, frame-ancestors none, nosniff, referrer and permissions policies).
- Contact API: JSON only, 10 KB cap, Zod validation, per-IP rate limits, honeypot + timing check, HTML-escaped emails, no internal errors leaked.
- No `dangerouslySetInnerHTML` except JSON-LD built with `JSON.stringify` and `<` escaped.
- Fonts are self-hosted by `next/font`; no external requests at runtime.
- `.env*`, `data/` and `qa-report/` are git-ignored.
