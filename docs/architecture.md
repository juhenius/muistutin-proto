# Architecture

## Muistutin PWA Architecture

### Overview
Muistutin is a privacy-first, installable Progressive Web App (PWA) designed to run entirely in the browser, with no backend, server, or cloud dependencies. All data is stored locally in the browser (localStorage). The app is fully offline-capable, installable on desktop and mobile, and leverages browser notifications for reminders (planned).

### Technical Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **PWA Features:**
  - Service Worker for offline support (planned)
  - Web App Manifest for installability
  - Browser notifications (Web Notifications API, planned)
  - Responsive, tablet-first design
- **Data Storage:** localStorage
- **Testing:** Jest (unit, planned), Cypress (E2E, planned)

### Key Components
- **Checklist UI:** Minimal, responsive, and optimized for tablets/phones
- **Reminder Engine:**
  - Supports both simple and complex recurrence rules (none, every day, weekdays, weekends, custom days, custom interval)
  - Per-day completion tracking for repeating reminders
  - Deadline support (time for repeating, date+time for non-repeating)
  - Demo data generation for testing
  - Mocked time for testing and demo
  - Late highlighting and time-to-deadline display
- **UI/UX Patterns:**
  - Floating Action Button (FAB) for all add/demo actions
  - Modal overlays for add/edit
  - Click-to-edit in All view
  - Top-aligned, minimal layout
  - Accessibility and responsive design
- **Localization:** Multi-language support (en, fi, sv, planned)

### PWA Features
- **Offline Support:** All features work without an internet connection
- **Installable:** Add to home screen on mobile or desktop
- **Service Worker:** Caches assets and data for offline use (planned)
- **Web App Manifest:** Defines app icon, name, theme color, and installability
- **Browser Notifications:** Reminders and escalation handled via Web Notifications API (planned)

### Data Model
- All data (members, reminders, checklist state, notification settings) is stored in browser localStorage (see `docs/datamodel.md`)

### Security & Privacy
- All data remains in the browser on the user's device
- No external network or cloud storage
- No authentication or user management beyond local roles

### Project Structure
- `src/` for all app code (components, hooks, utils, etc.)
- `public/manifest.json` for PWA manifest
- `public/service-worker.js` for service worker (planned)
- `types/` for type definitions

### Limitations
- No multi-device sync (unless using manual file export/import, planned)
- No email/SMS notifications (browser notifications only, planned)
- No cloud backup or remote access
