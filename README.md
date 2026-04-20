# TaskTide

TaskTide is a goal-planning app that turns big ambitions into small daily tasks.

## What is implemented

- Public landing page.
- Email/password and Google OAuth auth flows.
- Goal creation flow (prompt → generated breakdown → save plan).
- Today dashboard with task completion toggles.
- Progress dashboard with completion metrics and streaks.
- Multi-goal support with goal switching and deletion.
- Supabase-backed persistence with RLS policies.

## End-to-end setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env` and fill in values from your Supabase project:

```bash
cp .env.example .env
```

Required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

If these are missing, the app now shows an in-app setup screen instead of crashing.

### 3) Provision database schema

Run the SQL migration in `supabase/migrations/20260420162312_41e8ad0f-af49-4f74-a965-29251ddf866e.sql` in the Supabase SQL editor.

This creates:

- `profiles`
- `goals`
- `tasks`
- row-level-security (RLS) policies
- signup trigger for automatic profile creation

### 4) Configure auth providers

In Supabase Auth settings:

- Enable **Email** auth.
- (Optional) enable **Google** provider and set OAuth credentials.
- Set site URL to your local app URL (typically `http://localhost:5173`).

### 5) Run locally

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

- `npm run dev` – start dev server.
- `npm run build` – production build.
- `npm run lint` – lint source.
- `npm test` – run unit tests.

## Architecture notes

- Frontend: React + TypeScript + Vite + Tailwind.
- Routing: React Router.
- State: local component state + TanStack Query provider.
- Backend: Supabase (auth + Postgres).
- App logic lives in `src/lib/tasktide.ts`.

## Troubleshooting

- **Blank page or auth errors on startup**: verify `.env` values are correct.
- **Cannot persist goals/tasks**: ensure SQL migration was applied and RLS policies exist.
- **Google sign-in fails**: verify OAuth client credentials and redirect URL in Supabase.
