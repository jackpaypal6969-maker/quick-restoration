# Handing the site to the client's VPS

The site is self-contained: nothing in it references the preview server or
its domain, and secrets are never in the repo.

1. Push the final code to a repository the client controls (or give them this
   one and transfer ownership on GitHub).
2. On their server run the installer with their domain, pointing at their repo:

   ```bash
   REPO_URL=https://github.com/THEIR-ACCOUNT/quick-restoration.git CERTBOT_EMAIL=them@example.com bash setup-vps.sh their-domain.com --auto-update
   ```

3. Fill in `.env.production` by hand (never commit it): at minimum
   `NEXT_PUBLIC_SITE_URL`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and one email
   provider (`RESEND_API_KEY` or the `SMTP_*` set).
4. Point DNS at the new server; the installer runs certbot once DNS resolves.
5. Submit the contact form once and confirm the email arrives.
6. Optional: copy `data/leads.jsonl` if preview-period leads should move.
