# Swaralaya live deployment mirror

This directory mirrors the current public server code and static assets from
`www.swaralayaschoolofmusic.nl`.

Runtime data is intentionally not committed:

- `api/swaralaya-live-data.json` (admin configuration and submitted data)
- `api/uploads/` (admin-uploaded media)
- `.cache/` and `.codex-backups/` (server operational files)

The files above remain on the production server. Use the example configuration
in `api/swaralaya-live-data.example.json` when creating a separate environment.

## Smoke checks

```bash
node --check live-deployment/site-content-client.js
php -l live-deployment/api/index.php
```
