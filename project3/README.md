# Cats of NYUAD (EJS)

Minimal Express + EJS backend that renders your pages as templates and stores user-generated content on disk under `assets/uploads/` (no database).

## Quickstart

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Where data goes

- Entries (from **Share Entries**) → `assets/uploads/entries/*.json`
- Reports (from **Cat Watch**) → `assets/uploads/reports/*.json`

Each file is a simple document with `createdAt` timestamps. To wipe the data:
```bash
npm run clean
```

## Structure
```
/assets/uploads/
  /entries/  # saved entry JSON files
  /reports/  # saved report JSON files
/public/     # static assets (css/js/images)
/views/      # EJS templates (pages + partials)
server.js    # express app
```

## Notes
- No DB, no auth, deliberately simple.
- `/diary` renders the two most recent entries (if any).
- Health endpoint: `/healthz`.
