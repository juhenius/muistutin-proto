# Muistutin PWA

A modern, privacy-first family reminder app for busy mornings. Muistutin is a local-only, installable Progressive Web App (PWA) built with React 19, TypeScript, and Tailwind CSS. All data is stored in your browser—no cloud, no backend, no accounts, and no tracking.

## Features

- Add family members (local only)
- Add, edit, and remove reminders
- Assign reminders to members
- Flexible repeat rules: none, every day, weekdays, weekends, custom days, custom interval
- Per-day completion tracking for repeating reminders
- Deadlines: time for repeating, date+time for non-repeating reminders
- See deadline and time to deadline for each reminder
- See last completion time for repeating reminders
- Highlight late reminders
- Demo data generation for quick testing
- Mocked time for easy demo/testing
- Responsive, accessible, and installable (PWA)
- Floating Action Button (FAB) for all add/demo actions
- Modal overlays for add/edit
- Click-to-edit in All view
- Top-aligned, minimal layout

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **PWA:** Service Worker (planned), Web App Manifest
- **Data Storage:** localStorage
- **Testing:** Jest (planned), Cypress (planned)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open the app:**
   Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Folder Structure

- `src/` — Main app code (React components, styles)
- `public/` — Manifest, icons, service worker (if present)
- `docs/` — Project documentation (architecture, data model, frontend, backend, learnings, changelog, todo)
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `vite.config.ts` — Project configuration

## Documentation

- **Architecture:** `docs/architecture.md`
- **Data Model:** `docs/datamodel.md`
- **Frontend:** `docs/frontend.md`
- **Backend (in-browser logic):** `docs/backend.md`
- **Learnings:** `docs/learnings.md`
- **Changelog:** `docs/ai_changelog.md`
- **Todo:** `docs/todo.md`

## Limitations

- No multi-device sync (unless using manual file export/import, planned)
- No browser notifications or escalation yet (planned)
- No onboarding, roles, or advanced notification settings (planned)
- No cloud backup or remote access

## License

MIT
