# Swaralaya Live Deployment Package

This folder contains the current live deployment assets for Swaralaya School of Music.

## Files

- `site-content-client.js` - public website renderer and client logic.
- `api/index.php` - PHP API bridge for admin, content, enrollments, bookings, notifications, and SMTP mail.
- `admin/swaralaya-admin-app.html` - admin portal shell.
- `assets/` - Swaralaya logo, favicon, touch icon, and first-home-load animation.
- `api/swaralaya-live-data.example.json` - safe example data/config shape.

## Secrets

Do not commit the real `swaralaya-live-data.json`, admin password, developer key, or SMTP configuration files. The live server should keep those values outside Git or generate them from secure environment/server configuration.

## Smoke Checks

```bash
node --check live-deployment/site-content-client.js
php -l live-deployment/api/index.php
```
