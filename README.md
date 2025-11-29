# Cravings & Emotions Tracker

A simple, mobile-first Next.js app to track daily sugar cravings, stress, triggers, and weekly reflections. Data is stored locally in your browser (no backend), and you can export/import JSON at any time.

## Tech
- Next.js 14 (App Router) + TypeScript
- TailwindCSS for styling
- Chart.js via react-chartjs-2
- Validation via Zod + React Hook Form

## Getting started
```
pnpm i  # or npm i / yarn
pnpm dev
```
Open http://localhost:3000

## Notes
- Notifications are optional and limited by the browser (no background scheduling without a service worker).
- This is an MVP. You can swap the storage layer for Supabase or Firebase by replacing lib/storage.ts.
