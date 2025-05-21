# AI Changelog

## 2025-05-03
- **Feat:** Implemented namespace-based localization structure:
  - Created a script (`scripts/split-locales.js`) to split monolithic locale files into separate namespace files
  - Organized translations by feature/component under locale-specific folders (en/, fi/, sv/)
  - Added backup mechanism to preserve original locale files
  - Generated comprehensive localization report showing namespace coverage across all locales
  - Added npm script `split-locales` to package.json
  - Created detailed README.md in the messages directory documenting the new structure
  - Updated documentation in architecture.md, frontend.md, and .cursorrules
  - Added new `<localize>` action to .cursorrules with language-specific guidance for translations

## 2025-03-25
- Enhanced the Gemini AI tool with advanced capabilities:
  - Added document processing support for PDF, DOCX, and other file types
  - Implemented Google Search grounding feature for real-time information
  - Added structured JSON output functionality with predefined schemas
  - Fixed API compatibility with the latest @google/genai library (v0.7.0)
  - Updated documentation in .cursorrules with examples

## 2024-03-21
- Rescoped project from LastBot website to "AI-Powered Next.js Template for Cursor IDE"
- Updated project documentation:
  - Revised project description and core features
  - Restructured frontend documentation to focus on template features
  - Updated backend documentation to emphasize AI integration
  - Removed company-specific content and features
  - Added comprehensive AI service integration documentation

## 2023-07-27
- **Fix Build Errors:** Resolved `Dynamic server usage` errors during `npm run build` by adding `export const dynamic = 'force-dynamic';` to necessary page files (admin layout, privacy, root locale page, test, account pages, profile settings, most auth pages). Ignored build-time i18n database errors as requested. Build now completes successfully despite some remaining dynamic usage warnings.

## [Current Session]
- **Fix:** Resolved synchronous access errors for `searchParams` and `params` in multiple page components (`/admin/landing-pages`, `/blog`, `/[slug]`).
- **Fix:** Replaced insecure `getSession`/`onAuthStateChange` usage with `getUser()` in `AuthProvider` and `middleware` as per Supabase recommendations.
- **Fix:** Addressed authentication flow issues caused by the `getUser` refactor by refining middleware cookie handling.
- **Fix:** Removed extraneous Supabase auth debug logs by removing `DEBUG_AUTH` env variable.
- **Fix:** Resolved `supabase.from is not a function` error on public landing pages by using `createServerClient` with anon key.
- **Fix:** Addressed RLS permission errors on public landing pages (guided user to fix policy, code already correct).
- **Feat:** Added a 'Published' switch to the landing page admin form (`LandingPageForm.tsx`).
- **Fix:** Corrected the landing page editor (`[id]/page.tsx`) to use PATCH for updates and POST for creates.
- **Docs:** Updated the `Available Scripts` section in `README.md` to accurately reflect the command-line tools defined in `.cursorrules`.
- **Chore:** Added `NODE_ENV=production` prefix to production-related npm scripts in `package.json`.

*   Fixed landing page editor form showing empty fields due to missing API route for fetching single page by ID. Added `app/api/landing-pages/[id]/route.ts`.
*   Fixed Supabase RLS policy preventing anonymous users from viewing published landing pages. Refined RLS policies in migration `20250407180210`.
*   Fixed Next.js 15 warning by awaiting `params` in API route and `generateMetadata`.
*   Redesigned public landing page (`/[slug]`) styling using Tailwind CSS, added hero section with generated background, and improved typography.
*   Added dynamic CTA fields (`cta_headline`, `cta_description`, etc.) to `landing_pages` table (migration `20250407182326`).
*   Added "CTA" tab and fields to landing page editor.
*   Updated public landing page to display CTA content from the database.
*   Fixed missing translation keys for editor tabs/buttons.
*   Fixed Tiptap editor hydration error by setting `immediatelyRender: false`.
*   Removed unused preload link from `app/layout.tsx`.
*   Adjusted prose font sizes and colors for better readability on landing page.
*   Fixed i18n-ally translation detection issue by standardizing translation key paths in analytics components. Added missing translation keys for analytics fields (gaMeasurementId, gtmContainerId, fbPixelId, linkedinPixelId) to all language files.

## AI Changes Log

### 2025-06-04: Enhanced Video Generation Tool with Integrated Image Generation

- Enhanced the generate-video tool to support integrated image-to-video workflow
- Added `--image-prompt` parameter to generate an image with OpenAI GPT-image-1 before video creation
- Added support for image style and size parameters for generated images
- Improved URL handling for Replicate models that require image URLs
- Fixed compatibility issues between different model image input requirements
- Added warning for local image files which may not be supported by all models
- Added OpenAI dependency for image generation functionality

### 2025-06-03: Enhanced Video Generation Tool with Kling AI Models

- Updated the generate-video tool to support more Replicate video generation models
- Added support for Kling v1.6 standard and Kling v2.0 models
- Made Kling v1.6 the default model (previously minimax)
- Added support for aspect ratio selection (16:9, 9:16, 1:1) for supported models
- Enhanced image-to-video capabilities with proper parameter handling per model
- Added negative prompt and cfg_scale parameters for finer control
- Improved TypeScript typing with a ModelConfig interface
- Fixed module import issues for better compatibility

### 2025-04-20: Added OpenAI GPT-image-1 and DALL-E Image Generation Tool

- Created a new command-line tool for both image generation and editing using OpenAI's latest models
- Added support for GPT-image-1 and DALL-E 3 models
- Implemented advanced prompt optimization using GPT-4 Vision
- Added reference image support for GPT-image-1
- Configured various options for customization (size, style, quality)
- Updated package.json with necessary dependencies
- Added documentation in .cursorrules

### 2025-04-14: Enhanced GitHub CLI Tool with Task Management

- Installed inngest library for background task/event support.
- Added inngest client in lib/inngest-client.ts.
- Added sample background function in lib/inngest-functions.ts.
- Added API route handler in app/api/inngest/route.ts for Inngest event/function execution.

## 2025-06-05: Enhanced Homepage with AI-Generated Video Background

- Added the AI-generated video as a dynamic background on the homepage
- Implemented a fallback mechanism that shows a static image until the video loads
- Added graceful error handling to try multiple paths for video loading
- Improved loading experience with smooth opacity transitions
- Ensured the video is responsive across all device sizes
- Enhanced code with proper TypeScript typing and useRef for video control

## 2025-06-05: Fixed Homepage Hero Layout with Static Image

- Replaced video hero with static image solution due to persistent video loading issues
- Created separate StaticHero component for better maintainability
- Preserved the split-screen layout with text on left and visual element on right
- Optimized image loading with proper sizing attributes
- Added fallback gradient overlays for improved text readability
- Made the solution compatible with both local development and production deployment

## Muistutin PWA: Collaborative Design & Implementation Summary (Assistant + User)

1. **Initial Design & Documentation:**
   - Defined Muistutin's purpose: a family reminder app for busy mornings.
   - Created and updated documentation files (`architecture.md`, `datamodel.md`, `frontend.md`, `backend.md`, `todo.md`) to scope the project as a local-only, then pure PWA (no backend, browser storage only).
   - Data model included families, members, reminders, checklist state, and notification settings.

2. **Project Setup:**
   - Scaffolded a Vite + React 19 + TypeScript + Tailwind CSS PWA.
   - Implemented the frontpage with app title and minimal layout.
   - Configured dev server to serve at root URL.

3. **Core Features Implemented:**
   - **Family Members:** Add members (name only), persisted in localStorage.
   - **Reminders:** Add reminders with title and member assignment, persisted in localStorage.
   - **Editing/Removal:** Edit/removal of reminders with pre-filled forms and deletion.
   - **Mark as Done:** Mark reminders as done/undone, refactored for per-day completion for repeating reminders.
   - **Floating Action Button (FAB):** Centralized add actions in a FAB, opening modals for adding members/reminders.
   - **Demo Data:** FAB option to generate demo members/reminders for testing.

4. **Reminder Recurrence:**
   - Designed and implemented a flexible repeat rule system: none, every day, weekdays, weekends, custom days, custom intervals.
   - Reminder form included dropdown and controls for custom options.
   - Human-readable summary of repeat rule shown in form and list.

5. **Views and Filtering:**
   - "Today" view: shows reminders due today based on repeat rule.
   - "All" view: shows all reminders.
   - UI toggles between views; logic for due reminders implemented.

6. **Per-Day Completion for Repeating Reminders:**
   - Refactored done logic for per-day completion using a `history` array.
   - "Today" view's checkbox reflects completion for today.
   - Toggling checkbox updates today's entry in history.

7. **Completion History:**
   - Each reminder tracks a history of completion/uncompletion events (timestamp and done state).
   - Edit modal displays history, most recent first.

8. **Mocked Date/Time:**
   - FAB option to set/clear mocked current date/time, used throughout app logic.
   - Current date/time (mocked or real) shown in header, with badge.
   - Real time updates live every second if not mocked.

9. **UI/UX Refinements:**
   - Frontpage simplified to show only reminders.
   - Muistutin box reduced to just the title.
   - "Done" checkbox only in Today view; edit/remove only in All view.

**Result:**
A modern, local-only PWA for family reminders, with flexible recurrence, per-day completion, history tracking, and robust demo/testing mode. All logic, UI, and persistence match the evolving requirements.

## 2025-06-10: Muistutin PWA Feature & Documentation Update

- Added per-day completion for repeating reminders
- Implemented flexible repeat rules (every day, weekdays, weekends, custom days, custom interval)
- Added deadline support (time for repeating, date+time for non-repeating)
- Highlight late reminders in list views
- Show deadline and time to deadline for each reminder
- Show last completion time for repeating reminders
- Added demo data generation and mocked time for testing
- Refined UI/UX: top-aligned layout, FAB, modal overlays, click-to-edit in All view, responsive and accessible design
- Updated all documentation files to match current app state

