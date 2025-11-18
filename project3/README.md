# Cats of NYUAD (Express + EJS)

A minimal Node.js app for sharing NYUAD cat diary entries and submitting neighborhood reports. Pages are rendered with EJS templates, and data is saved as JSON files on disk. Image uploads are stored locally. There is no database or authentication.

## Quickstart

Requirements: Node.js 18+ and npm

```bash
npm install
npm run dev
# open http://localhost:3000
```

- Development: `npm run dev` starts the server on port 3000.
- Production: `npm start` runs with `NODE_ENV=production`.
- Clean local data: `npm run clean` removes files under `assets/uploads/*`.

## Features

- Share diary entries with cat name, photographer, location, image (upload or URL), and description.
- Browse entries (newest first) on the diary page.
- Submit reports with name, location, and issue.
- Fully file-backed storage using JSON; no external services required.

## Routes

- `GET /` – Cover page.
- `GET /about` – About page.
- `GET /add-entry` – Form to add a diary entry.
- `POST /entries` – Handles entry submission. Accepts:
  - Multipart upload field: `catImage` (image files only)
  - Or text field: `imageUrl` (fallback if no upload)
  - Other fields: `catName`, `photographer`, `location`, `description`
- `GET /diary` – Lists saved entries (newest first).
- `GET /report` – Form to submit a report.
- `POST /reports` – Handles report submission with fields: `name`, `location`, `issue`.

Static files are served from `public/` and uploaded assets from `assets/`. Uploaded images are accessible under `/uploads/images/...`.

## Data & Storage

All data is stored locally under `assets/uploads/` as JSON files and images:

- Diary entries JSON → `assets/uploads/entries/*.json`
- Reports JSON → `assets/uploads/reports/*.json`
- Uploaded images → `assets/uploads/images/*`

Each JSON document includes a `createdAt` timestamp. Use `npm run clean` to wipe local data.

## Project Structure

```
/assets/
  /uploads/
    /entries/   # saved entry JSON files
    /reports/   # saved report JSON files
    /images/    # saved image uploads
/public/        # static assets (css, js, images)
/views/         # EJS templates (pages + partials)
  /partials/
server.js       # Express app
package.json
```

## Tech Stack

- Express 4
- EJS templates
- Multer for file uploads (images only)
- body-parser for form parsing

## How it works

- `server.js` sets up Express, serves `public/` and `assets/`, configures EJS views, and defines routes.
- Image uploads use Multer’s disk storage at `assets/uploads/images/` with unique filenames.
- Entries and reports are persisted as pretty-printed JSON via a small helper that writes to `assets/uploads/{entries|reports}/`.
- The diary page loads all entries from disk and sorts them by `createdAt` (newest first).

## Deployment notes

- The app listens on port `3000` by default (hard-coded in `server.js`). Update `app.listen` if you need a different port or want to read from `process.env.PORT`.
- For production, make sure the process has write permissions to `assets/uploads/`.
- This project is designed for small, single-host deployments; it does not handle concurrency or shared storage across instances.

## Limitations

- No authentication or authorization.
- No database; data is local to the server and cleared by `npm run clean`.
- Minimal validation (image MIME type is checked on upload; text fields are trimmed).
- Not hardened for internet exposure; treat as a course/demo project.

## Scripts

```json
{
  "scripts": {
    "dev": "node server.js",
    "start": "NODE_ENV=production node server.js",
    "clean": "rm -rf assets/uploads/*"
  }
}
```

## Responsible Use

This project is intended for educational and community purposes. Please use it responsibly and appropriately—preferably within the NYU Abu Dhabi (NYUAD) community. When collecting, sharing, or displaying content:

- Respect privacy and obtain consent where applicable.
- Avoid posting sensitive or personally identifiable information.
- Follow NYU/NYUAD policies, local laws, and community guidelines.
- Use uploaded materials (photos, text) only if you have the right to share them.

## License

MIT
