# Frontend Documentation

## Muistutin PWA Frontend Design

All logic and data storage run entirely in the browser. The app is a fully offline-capable, installable PWA with no backend or server. All notifications are browser-based (Web Notifications API, planned). The app is privacy-first: all data stays on the user's device.

### Main Screens
1. **Reminders View**
   - Shows reminders for today (filtered by repeat rule and completion) and all reminders
   - Mark as done/undone for today (per-day completion)
   - Add/edit/delete reminders
   - Assign reminders to members
   - Set flexible repeat rules (none, every day, weekdays, weekends, custom days, custom interval)
   - Set deadlines (time for repeating, date+time for non-repeating)
   - See deadline and time to deadline for each reminder
   - See last completion time for repeating reminders
   - Highlight late reminders
   - Demo data generation (FAB)
   - Mocked time for testing
   - Responsive, accessible, top-aligned layout
   - Floating Action Button (FAB) for all add/demo actions
   - Modal overlays for add/edit
   - Click-to-edit in All view

### PWA Features
- **Offline Support:** All features work without an internet connection
- **Installable:** Add to home screen on mobile or desktop
- **Service Worker:** Caches assets and data for offline use (planned)
- **Web App Manifest:** Defines app icon, name, theme color, and installability
- **Browser Notifications:** Reminders and escalation handled via Web Notifications API (planned)

### UX Patterns
- Minimal, distraction-free design
- All actions are instant (browser storage)
- No login or cloud sync (privacy-first)
- Responsive and accessible
- Localization: en, fi, sv (planned)

### Limitations
- No multi-device sync (unless using manual file export/import, planned)
- No email/SMS notifications
- No cloud backup or remote access

### UI/UX Patterns
- **Minimal, Rewarding UI:**
  - Large checkboxes, clear status, positive feedback for completed tasks
  - Escalating color/sound/animation for missed tasks
  - Friendly, non-punitive language
- **Tablet-First Design:**
  - Optimized for shared device by the door
  - Responsive for mobile/desktop
- **Accessibility:**
  - High contrast, large touch targets, screen reader support
- **Localization:**
  - All UI translatable (en, fi, sv)
- **Real-Time Updates:**
  - Checklist and reminders update instantly for all users
- **Notification UX:**
  - Gentle popups for completed tasks
  - Persistent banners, sound, or vibration for missed/overdue tasks

### Component Ideas
- ChecklistItem (with status, assignee, escalation)
- ReminderForm (recurrence, assignment, intrusiveness)
- FamilyMemberAvatar
- NotificationBanner
- EscalationAnimation