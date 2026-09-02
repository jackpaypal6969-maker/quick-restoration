/**
 * PM2 process definition for Quick Restoration.
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 reload quick-restoration
 * `next start` reads .env.production from the app directory automatically.
 * The app binds to loopback only (Nginx is the public face) and runs as the
 * unprivileged `quick-restoration` user created by deploy/setup-vps.sh; the
 * PM2 daemon itself stays root.
 */
const path = require("path");

module.exports = {
  apps: [
    {
      name: "quick-restoration",
      cwd: path.resolve(__dirname, ".."),
      script: "node_modules/next/dist/bin/next",
      // HOST=0.0.0.0 for a bare IP:PORT preview; default binds to loopback behind Nginx.
      args: `start -H ${process.env.HOST || "127.0.0.1"}`,
      instances: 1, // rate limiter + lead log are per-process; keep a single instance
      exec_mode: "fork",
      uid: "quick-restoration",
      gid: "quick-restoration",
      autorestart: true,
      max_memory_restart: "450M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3010,
      },
    },
  ],
};
