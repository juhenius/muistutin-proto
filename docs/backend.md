# Backend Architecture

## Muistutin PWA Logic (No Backend)

### Overview
Muistutin is a pure Progressive Web App (PWA) with no backend, server, or API endpoints. All logic and data storage run entirely in the browser (localStorage). The app is fully offline-capable and privacy-first.

### In-Browser Logic
- **Reminder Engine:** Handles creation, editing, deletion, recurrence, per-day completion, deadlines, and late highlighting
- **Checklist State:** Tracks completion of reminders per day
- **Member Management:** All members are managed locally in the browser
- **Demo Data:** FAB for generating demo reminders and members
- **Mocked Time:** For testing and demo purposes

### Data Storage
- All data is stored in browser localStorage
- No data leaves the device; fully offline and privacy-first

### Notification Logic (Planned)
- **Browser Notifications:**
  - Sent for upcoming and overdue reminders using the Web Notifications API (planned)
  - Escalate from gentle to intrusive if not marked done (planned)
  - Configurable per user (planned)
- **In-App Alerts:**
  - Persistent banners, sound, or animation for missed tasks (planned)
- **No Email/SMS:**
  - Only browser notifications are supported (planned)

### Security & Privacy
- All data remains in the browser on the user's device
- No authentication or user management
- No network or cloud access

### Limitations
- No multi-device sync (unless using manual file export/import, planned)
- No cloud backup or remote access
- No email/SMS notifications
