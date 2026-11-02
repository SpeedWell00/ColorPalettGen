# Color Palette Generator

React application with a generator (`/`), saved palettes (`/saved`), palette details (`/palette/:id`) and an account page (`/account`). Colors come from TheColorAPI. Supabase Auth handles email/password accounts and PostgreSQL stores each user's palettes. Context shares the current session and palette data.

## Local development

Use Node.js 22 or newer. In this folder:

```bash
npm ci
cp .env.example .env.local
npm run dev -- --host 0.0.0.0
```

Set the two variables in `.env.local` before starting. Without them the generator remains usable, but accounts and saving are unavailable. Never commit `.env.local`.

## Supabase setup (required before release)

1. Create/select a Supabase project with the Data API enabled for `public`.
2. Run `supabase/schema.sql` once in SQL Editor on a database with no existing `public.palettes` table. It is transactional and does not overwrite existing tables. It enables row-level security and grants authenticated users only SELECT and INSERT on their own rows. Guests have no table access. Palette names are case-insensitively unique per user.
3. Enable email/password authentication and account registration. Use a password minimum of at least 8 characters. Keep email confirmation enabled.
4. Set Auth Site URL to `https://www.colorpalette-generator.com`. Add these exact redirect URLs:
   - `https://www.colorpalette-generator.com/account`
   - `https://colorpalette-generator.com/account`
   - Your development or preview origin followed by `/account`, if needed.
5. Configure custom SMTP to send confirmation emails to public users. Supabase's default sender only delivers to project team addresses and is for testing. Do not treat public registration as ready before SMTP is tested. See https://supabase.com/docs/guides/auth/auth-smtp.
6. Get the Project URL and **publishable** key from the project's Connect dialog. Do not use a secret key or `service_role` key in this frontend.

## Vercel

Keep Root Directory as `color-palette-generator/color-palette`, framework Vite, build `npm run build`, output `dist`.

Add the following environment variables for the environment being deployed:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

These are public client configuration; database access is restricted by RLS, not by hiding this key. Redeploy after setting them. `vercel.json` sends direct page requests to the React app, including email confirmation redirects and palette detail refreshes.

## Validation

```bash
npm test
npm run build
```

Database tests use local PGlite PostgreSQL with an `auth.uid()` test fixture. They test owner-only reads/writes, guest rejection, duplicate names, name/hex constraints and denied update/delete operations. Session tests mock Supabase and test account switching, delayed requests, load errors/retry and saving. They do not verify a live Supabase project or email delivery.

Before production, create two test accounts through the UI, confirm emails, save a palette, refresh and sign in on another browser. Confirm account B cannot view account A's palette by URL and cannot save rows with A's user ID through the API. Check wrong passwords, duplicate palette names and sign-out. Verify direct `/saved` and `/palette/:id` links on Vercel.

## Code map

- `src/context/AuthContext.jsx`: session subscription and sign-out.
- `src/context/PaletteContext.jsx`: API generation and database reads/inserts.
- `src/main.jsx`: resets palette state when the signed-in account changes.
- `src/pages/Account.jsx`: registration, login and logout.
- `src/components/AccountGate.jsx`: session/load/error states for private pages.
- `supabase/schema.sql`: table constraints, per-user uniqueness and RLS policies.

HEX input must match `^#([0-9A-Fa-f]{6})$`. Palette names must contain 3–25 characters after trimming. Existing in-memory palettes from before this update are not migrated. No password is stored in the palettes table.
