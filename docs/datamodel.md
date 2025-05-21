# Data Model

## Muistutin PWA Data Model

All data is stored in the browser using localStorage. No external database, cloud storage, or local files are used. The app is fully offline-capable and privacy-first.

### Core Entities

#### Member
- name: string (unique per app instance)

#### Reminder
- title: string
- assignedTo: string (member name)
- done: boolean (for non-repeating reminders)
- repeat: RepeatRule (see below)
- history: Array<{ timestamp: number, done: boolean }> (per-day completion for repeating reminders)
- deadline: string (for repeating: 'HH:mm', for non-repeating: ISO date+time string)

##### RepeatRule
- type: 'none' | 'everyday' | 'weekdays' | 'weekends' | 'daysOfWeek' | 'custom'
- days: number[] (for daysOfWeek)
- interval: number, unit: 'day' | 'week' | 'month' (for custom)

##### Completion History
- For repeating reminders, completion is tracked per day in the history array
- For non-repeating reminders, 'done' is a boolean

### Storage
- All data is stored in browser localStorage
- No data leaves the device; fully offline and privacy-first
