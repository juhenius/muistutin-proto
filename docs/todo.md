# Muistutin Project Todo List (PWA)

## 1. Planning & Design
- [x] Finalize user stories and use cases for busy families
- [x] Design minimal, tablet-friendly UI/UX wireframes
- [x] Define browser data model (members, reminders, checklist, notifications)
- [x] Plan localization (en, fi, sv)

## 2. PWA Implementation
- [x] Set up React 19 + TypeScript + Tailwind CSS project (no Next.js)
- [x] Implement localStorage data layer
- [x] Implement service worker for offline support (planned)
- [x] Create web app manifest (icon, name, theme color, installability)
- [x] Ensure app is installable on mobile/desktop
- [x] Implement manual data import/export for optional sync/backup (planned)

## 3. Frontend
- [x] Build Family Dashboard (shared checklist, mark as done, add reminders)
- [x] Build Reminder Management UI (add/edit/delete, recurrence, assignment)
- [x] Add per-day completion for repeating reminders
- [x] Add flexible repeat rules (every day, weekdays, weekends, custom days, custom interval)
- [x] Add demo data generation (FAB)
- [x] Add deadline support for reminders (time for repeating, date+time for non-repeating)
- [x] Highlight late reminders in list views
- [x] Show deadline and time to deadline in list
- [x] Show last completion time for repeating reminders
- [x] Add mocked time support for testing
- [x] UI/UX refinements: top-aligned content, FAB, modals, click-to-edit, etc.
- [x] Responsive and accessible design
- [x] Add localization support (en, fi, sv) (planned)

## 4. Notifications & Escalation (Browser Only)
- [ ] Implement browser notification scheduling and delivery (planned)
- [ ] Implement in-app notification banners and sounds (planned)
- [ ] Allow user/parent configuration of notification "annoyance" level (planned)
- [ ] Support quiet hours and per-user notification preferences (planned)

## 5. Testing
- [ ] Write unit tests for core logic (Jest) (planned)
- [ ] Write E2E tests for main flows (Cypress) (planned)
- [ ] Test notification escalation and UX (planned)
- [ ] Test accessibility and localization (planned)
- [ ] Test offline and installability features (planned)

## 6. Documentation
- [x] Update architecture, data model, frontend docs (PWA)
- [ ] Document notification and escalation logic (planned)
- [ ] Add user guide for families (planned)

## 7. Launch & Feedback
- [ ] Prepare for local/PWA deployment (static hosting) (planned)
- [ ] Run user testing with families (planned)
- [ ] Collect feedback and iterate on UX/notifications (planned)
- [ ] Finalize launch and announce (planned)

