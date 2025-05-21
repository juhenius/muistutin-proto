# Muistutin: The Family Reminder App for Busy Mornings

## Overview
Muistutin is a web application designed for busy parents and families to ensure nothing is forgotten before leaving home in the morning. It provides a shared, collaborative checklist and reminder system that helps parents and kids remember both daily routines and one-off tasks, with a focus on ease of use, minimal design, and effective (sometimes intrusive) notifications when things are forgotten.

## Use Cases
- **Morning Routine Management:** Remind family members to take medicine, put on sunscreen, grab keys, phone, or other essentials before leaving.
- **One-off Reminders:** Add special reminders for items or tasks needed only on a specific day (e.g., bring a project to school, leave early for an appointment).
- **Shared Accountability:** Allow all family members to mark tasks as done in a shared, real-time checklist (e.g., on a tablet by the door).
- **Flexible Recurrence:** Support complex repeating rules for reminders (e.g., every weekday, every other Friday, only on school days, etc.).
- **Intrusive Alerts:** If tasks are not marked as done, escalate reminders to be more noticeable (e.g., persistent notifications, sound, or visual cues).

## Core Features
- **Shared Checklist:** Real-time, collaborative checklist for the whole family, accessible on multiple devices.
- **Repeating & One-off Reminders:** Add both recurring and single-use reminders with flexible scheduling.
- **Complex Recurrence Rules:** Natural language or advanced scheduling for reminders (e.g., "every weekday at 7:30am", "every 2nd Monday").
- **Mark as Done:** Family members can check off tasks as they are completed; everyone sees updates instantly.
- **Intrusive Notification System:** Gentle reminders for completed tasks, but increasingly persistent (and optionally annoying) notifications for forgotten items.
- **Minimal, Friendly UI:** Clean, distraction-free interface that feels rewarding when tasks are done, but hard to ignore when they are not.
- **Easy Task Management:** Quickly add, edit, or remove reminders; assign to individuals or the whole family.
- **Multi-Device Support:** Works on tablets, phones, and desktops; optimized for a shared device in the home.
- **Localization:** Multi-language support for Finnish, Swedish, and English.

## Technical Features
- Real-time sync (Supabase/Postgres)
- Push notifications (web/mobile)
- Role-based access (parent/child)
- Secure authentication (Supabase Auth)
- Responsive, accessible design (Tailwind CSS)
- Comprehensive testing (Jest, Cypress)

## Differentiators
- Designed for families, not just individuals
- Focus on both positive reinforcement and persistent reminders
- Flexible recurrence for real-life routines
- Minimal, beautiful, and family-friendly UI
