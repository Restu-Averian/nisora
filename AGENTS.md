# Agent Notes

## Repo Shape
- Root app is a Vite React app using JavaScript/JSX; keep app files as `.js`/`.jsx` unless an existing file is TypeScript.
- `src/js-toolkit` is a git submodule and separate TypeScript package (`@resuave/js-toolkit`) with its own `package-lock.json`; do not treat it as normal app source unless the task explicitly targets the toolkit.
- Use `@/` imports for root app code; both `vite.config.js` and `jsconfig.json` map `@` to `src`.

## UI Conventions
- shadcn/ui is configured for JSX (`components.json` has `tsx: false`) with aliases `@/components`, `@/components/ui`, `@/lib`, and `@/hooks`.
- Reuse existing shadcn-style primitives in `src/components/ui` and the `cn` helper from `@/lib/utils` before adding new UI helpers.
- Tailwind CSS v4 is configured through `@tailwindcss/vite`; design tokens and fonts live in `src/index.css`, with component classes like `.form-control` in `src/styles/library.css`.
- The visible app UI is in Bahasa Indonesia; keep new user-facing copy consistent.
- Existing responsive patterns switch mobile to `Drawer` and larger screens to `Dialog` using `useBreakpoint` from `@/js-toolkit/src/react`.

## Supabase
- Browser Supabase clients require `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; `.env.example` documents the keys and real env files are ignored.
- Root app imports the singleton Supabase client from `@/lib/supabase`; profile auth also uses `decryptStoredUserCookie` from the toolkit source.

## Commands
- Package manager is npm (`package-lock.json` at root, plus a separate lockfile inside `src/js-toolkit`).
- Root scripts are `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`; do not run package scripts unless explicitly instructed.
- There is no configured root test script; avoid inventing test commands.

## Change Rules
- Make the smallest safe change, avoid breaking existing props/exports, and prefer existing components, hooks, utilities, and dependencies.
- Do not add libraries unless explicitly requested.
- Handle loading, error, and empty states when adding data-driven UI.
