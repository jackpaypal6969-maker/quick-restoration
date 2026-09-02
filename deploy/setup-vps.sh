#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Quick Restoration — one-shot VPS install / update (Ubuntu/Debian, run as root).
#
#   Preview on a bare port, no domain / Nginx / TLS (http://SERVER_IP:PORT):
#        curl -fsSL https://raw.githubusercontent.com/jackpaypal6969-maker/quick-restoration/main/deploy/setup-vps.sh -o setup-vps.sh && bash setup-vps.sh --preview --auto-update
#
#   Real domain (adds the Nginx site and a Let's Encrypt certificate):
#        CERTBOT_EMAIL=you@example.com bash setup-vps.sh quick.example.com --auto-update
#
#   --auto-update installs a root cron job that checks GitHub every 5 minutes and
#   pulls, rebuilds and reloads when the branch has a new commit
#   (log: /var/log/quick-restoration-update.log; remove: rm -f /etc/cron.d/quick-restoration).
#   Manual update later:  bash setup-vps.sh --preview --update   (or with the domain)
#
#   Local copy instead of git (SFTP the folder up, then run the script inside it):
#        LOCAL=1 bash quick-restoration/deploy/setup-vps.sh --preview
#
# Env overrides: PORT (default: reuse the app's port, else first free from 3010),
# REPO_URL, BRANCH (main), SRC_DIR, CERTBOT_EMAIL, GITHUB_TOKEN (only for a private
# repo; stored root-only in /root/.config/quick-restoration/github-token), LOCAL=1.
# Safe to re-run. Never touches other sites: it only writes
# /etc/nginx/sites-available/quick-restoration (domain mode) and a PM2 app named
# quick-restoration.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

USAGE="usage: bash setup-vps.sh <domain> [--update] [--auto-update]   |   bash setup-vps.sh --preview [--update] [--auto-update]"
DOMAIN=""
PREVIEW=0
MODE="install"
AUTO_UPDATE=0
for arg in "$@"; do
  case "$arg" in
    --preview) PREVIEW=1 ;;
    --update)  MODE="--update" ;;
    --auto-update) AUTO_UPDATE=1 ;;
    -h|--help) echo "$USAGE"; exit 0 ;;
    *)         DOMAIN="$arg" ;;
  esac
done

if [[ "$PREVIEW" == "0" ]]; then
  if [[ -z "$DOMAIN" ]]; then
    echo "$USAGE" >&2
    exit 2
  fi
  DOMAIN="${DOMAIN,,}"
  DOMAIN_RE='^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'
  if [[ ! "$DOMAIN" =~ $DOMAIN_RE ]]; then
    echo "setup-vps.sh: '$DOMAIN' is not a valid domain name (expected e.g. quick.example.com)" >&2
    exit 2
  fi
fi

REPO_URL="${REPO_URL:-https://github.com/jackpaypal6969-maker/quick-restoration.git}"
BRANCH="${BRANCH:-main}"
SRC_DIR="${SRC_DIR:-/var/www/quick-restoration-src}"
APP_NAME="quick-restoration"
# The site lives at the repo root; older checkouts had it in a quick-restoration/ subfolder.
app_dir_for() { if [[ -f "$1/package.json" ]]; then echo "$1"; else echo "$1/quick-restoration"; fi; }
APP_DIR="$(app_dir_for "$SRC_DIR")"
NGINX_SITE="/etc/nginx/sites-available/$APP_NAME"
if [[ "${LOCAL:-0}" == "1" ]]; then
  APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  SRC_DIR="$(dirname "$APP_DIR")"
fi

CONFIG_DIR="/root/.config/quick-restoration"
TOKEN_FILE="$CONFIG_DIR/github-token"
MODE_FILE="$CONFIG_DIR/mode"
mkdir -p "$CONFIG_DIR" && chmod 700 "$CONFIG_DIR"
if [[ -z "${GITHUB_TOKEN:-}" && -f "$TOKEN_FILE" ]]; then
  GITHUB_TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
fi

# Port: explicit PORT wins; else reuse the port this app already runs on; else first free from 3010.
port_in_use() { timeout 1 bash -c "</dev/tcp/127.0.0.1/$1" >/dev/null 2>&1; }
if [[ -z "${PORT:-}" && -f "$APP_DIR/.env.production" ]]; then
  PORT="$(sed -n 's/^PORT=\([0-9]*\).*/\1/p' "$APP_DIR/.env.production" | head -1)"
fi
if [[ -z "${PORT:-}" ]]; then
  PORT=3010
  while port_in_use "$PORT"; do PORT=$((PORT + 1)); done
  echo "Using free port $PORT (set PORT=… to choose one)"
fi
if [[ ! "$PORT" =~ ^[0-9]{2,5}$ ]] || (( PORT < 1024 || PORT > 65535 )); then
  echo "setup-vps.sh: PORT must be a number between 1024 and 65535 (got '$PORT')" >&2
  exit 2
fi

log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

# 1. System dependencies --------------------------------------------------------
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -c2- | cut -d. -f1)" -lt 20 ]]; then
  log "Installing Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
command -v git >/dev/null 2>&1 || { log "Installing git"; apt-get install -y git; }
command -v pm2 >/dev/null 2>&1 || { log "Installing PM2"; npm install -g pm2; }
if [[ "$PREVIEW" == "0" ]]; then
  command -v nginx >/dev/null 2>&1 || { log "Installing nginx"; apt-get install -y nginx; }
fi

# 2. Source ----------------------------------------------------------------------
if [[ "${LOCAL:-0}" == "1" ]]; then
  # Use the project folder this script lives in (…/quick-restoration/deploy/setup-vps.sh).
  [[ -f "$APP_DIR/package.json" ]] || { echo "LOCAL=1 but $APP_DIR has no package.json" >&2; exit 2; }
  log "Using local project at $APP_DIR"
else
  GIT_AUTH=()
  if [[ -n "${GITHUB_TOKEN:-}" && "$REPO_URL" == https://github.com/* ]]; then
    # Send the token as a header for this run only; the stored remote stays token-free.
    GIT_AUTH=(-c "http.https://github.com/.extraheader=AUTHORIZATION: bearer $GITHUB_TOKEN")
  fi
  if [[ -d "$SRC_DIR/.git" ]]; then
    # If the checkout was cloned with a token embedded in the URL, strip it from .git/config
    # (the token lives root-only in $TOKEN_FILE instead).
    current_url="$(git -C "$SRC_DIR" remote get-url origin 2>/dev/null || true)"
    if [[ "$current_url" == *@github.com/* ]]; then
      embedded="${current_url#https://}"; embedded="${embedded%%@github.com/*}"; embedded="${embedded#*:}"
      [[ -z "${GITHUB_TOKEN:-}" && -n "$embedded" ]] && GITHUB_TOKEN="$embedded"
      git -C "$SRC_DIR" remote set-url origin "$REPO_URL"
      if [[ -n "${GITHUB_TOKEN:-}" && "$REPO_URL" == https://github.com/* ]]; then
        GIT_AUTH=(-c "http.https://github.com/.extraheader=AUTHORIZATION: bearer $GITHUB_TOKEN")
      fi
    fi
    log "Updating source ($BRANCH)"
    git "${GIT_AUTH[@]}" -C "$SRC_DIR" fetch --depth 1 origin "$BRANCH"
    git -C "$SRC_DIR" checkout -q "$BRANCH"
    git -C "$SRC_DIR" reset -q --hard "origin/$BRANCH"
  else
    log "Cloning $REPO_URL ($BRANCH) into $SRC_DIR"
    git "${GIT_AUTH[@]}" clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$SRC_DIR"
  fi
fi

[[ "${LOCAL:-0}" == "1" ]] || APP_DIR="$(app_dir_for "$SRC_DIR")"
cd "$APP_DIR"

# Remember the token (root-only) and the mode so --update and the cron job need no arguments.
if [[ -n "${GITHUB_TOKEN:-}" && "${SAVE_TOKEN:-1}" != "0" && "${LOCAL:-0}" != "1" ]]; then
  if [[ ! -f "$TOKEN_FILE" || "$(tr -d '[:space:]' < "$TOKEN_FILE")" != "$GITHUB_TOKEN" ]]; then
    ( umask 077; printf '%s\n' "$GITHUB_TOKEN" > "$TOKEN_FILE" )
    echo "GitHub token saved to $TOKEN_FILE (root-only) for future updates."
  fi
fi
if [[ "$PREVIEW" == "1" ]]; then printf -- '--preview\n' > "$MODE_FILE"; else printf '%s\n' "$DOMAIN" > "$MODE_FILE"; fi
chmod 600 "$MODE_FILE"

# 3. Environment -----------------------------------------------------------------
if [[ "$PREVIEW" == "1" ]]; then
  PUBLIC_IP="$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
  SITE_URL="http://$PUBLIC_IP:$PORT"
else
  SITE_URL="https://$DOMAIN"
fi
if [[ ! -f .env.production ]]; then
  log "Creating .env.production from .env.example (fill in email credentials!)"
  cp .env.example .env.production
fi
# Keep URL and port in sync with this run (safe on re-runs; other values untouched).
sed -i "s#^NEXT_PUBLIC_SITE_URL=.*#NEXT_PUBLIC_SITE_URL=$SITE_URL#" .env.production
sed -i "s#^PORT=.*#PORT=$PORT#" .env.production
chmod 600 .env.production
mkdir -p data && chmod 750 data

# 4. Build -----------------------------------------------------------------------
log "Installing dependencies"
npm ci --no-audit --no-fund
log "Building"
npm run build

# 5. Service user + ownership (Node runs unprivileged; PM2 daemon stays root) -------
id -u "$APP_NAME" >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin "$APP_NAME"
chmod o+x "$SRC_DIR" "$APP_DIR"
chown -R "$APP_NAME:$APP_NAME" "$APP_DIR/.next" "$APP_DIR/data"
chown "$APP_NAME:$APP_NAME" "$APP_DIR/.env.production"
chmod 600 "$APP_DIR/.env.production"

# 6. PM2 -------------------------------------------------------------------------
export PORT
export HOST="127.0.0.1"
[[ "$PREVIEW" == "1" ]] && export HOST="0.0.0.0"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  log "Reloading PM2 app $APP_NAME on port $PORT ($HOST)"
  pm2 reload deploy/ecosystem.config.cjs --update-env
else
  log "Starting PM2 app $APP_NAME on port $PORT ($HOST)"
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save >/dev/null
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# 7. Nginx + TLS (domain mode only) ------------------------------------------------
if [[ "$PREVIEW" == "0" ]]; then
  if [[ "$MODE" != "--update" || ! -f "$NGINX_SITE" ]]; then
    log "Writing nginx site $NGINX_SITE"
    sed -e "s#__DOMAIN__#$DOMAIN#g" -e "s#__PORT__#$PORT#g" deploy/nginx.conf.template > "$NGINX_SITE"
    ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/$APP_NAME"
    nginx -t
    systemctl reload nginx
  fi
  if [[ "$MODE" != "--update" ]]; then
    if command -v certbot >/dev/null 2>&1 || apt-get install -y certbot python3-certbot-nginx >/dev/null 2>&1; then
      if [[ -n "${CERTBOT_EMAIL:-}" ]]; then
        log "Requesting Let's Encrypt certificate for $DOMAIN"
        certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect || \
          echo "certbot failed (DNS not pointing here yet?). Re-run: certbot --nginx -d $DOMAIN --redirect"
      else
        echo
        echo "TLS: run when DNS for $DOMAIN points at this server:"
        echo "  certbot --nginx -d $DOMAIN --redirect"
      fi
    fi
  fi
else
  # Preview mode: open the port in ufw if the firewall is active.
  if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then
    log "Opening port $PORT in ufw"
    ufw allow "$PORT/tcp" >/dev/null
  fi
fi

# 8. Optional hands-off updates ----------------------------------------------------
if [[ "$AUTO_UPDATE" == "1" ]]; then
  if [[ "${LOCAL:-0}" == "1" ]]; then
    echo "--auto-update needs a git checkout (not LOCAL=1); skipping."
  else
    log "Installing 5-minute auto-update (cron)"
    cat > /usr/local/bin/quick-restoration-autoupdate <<EOS
#!/usr/bin/env bash
# Pull + rebuild Quick Restoration only when the GitHub branch has a new commit.
set -euo pipefail
SRC_DIR="$SRC_DIR"
BRANCH="$BRANCH"
TOKEN_FILE="$TOKEN_FILE"
MODE_FILE="$MODE_FILE"
[[ -d "\$SRC_DIR/.git" && -f "\$MODE_FILE" ]] || exit 0
AUTH=()
if [[ -f "\$TOKEN_FILE" ]]; then
  AUTH=(-c "http.https://github.com/.extraheader=AUTHORIZATION: bearer \$(tr -d '[:space:]' < "\$TOKEN_FILE")")
fi
local_sha="\$(git -C "\$SRC_DIR" rev-parse HEAD)"
remote_sha="\$(git "\${AUTH[@]}" -C "\$SRC_DIR" ls-remote origin "refs/heads/\$BRANCH" | cut -f1)"
[[ -n "\$remote_sha" && "\$remote_sha" != "\$local_sha" ]] || exit 0
echo "[\$(date -Is)] new commit \$remote_sha, updating"
exec bash "$APP_DIR/deploy/setup-vps.sh" "\$(cat "\$MODE_FILE")" --update
EOS
    chmod 700 /usr/local/bin/quick-restoration-autoupdate
    cat > /etc/cron.d/quick-restoration <<EOS
# Quick Restoration: check GitHub every 5 minutes and redeploy on a new commit.
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
*/5 * * * * root flock -n /run/lock/quick-restoration-update.lock /usr/local/bin/quick-restoration-autoupdate >> /var/log/quick-restoration-update.log 2>&1
EOS
    chmod 644 /etc/cron.d/quick-restoration
    echo "Auto-update installed. Remove with: rm -f /etc/cron.d/quick-restoration"
  fi
fi

log "Done. $SITE_URL  |  pm2 logs $APP_NAME  |  leads: $APP_DIR/data/leads.jsonl"
echo "Next: put RESEND_API_KEY or SMTP_* in $APP_DIR/.env.production so form leads are emailed, then: pm2 restart $APP_NAME"
