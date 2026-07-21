# Strain Tracker

A personal cannabis strain tracking app built with Next.js (App Router), Tailwind CSS, and Neon Postgres. Deploy to Vercel for free.

## Features

### Track your strains
- Add strains with **name, type, vendor/company, consumption method, effects, price, and a 1–5 star rating**
- **CBD %** field (for products that also contain THC)
- **"Makes me high" (psychoactive)** toggle
- **Top 3 terpenes** per strain, with autocomplete for common terpenes
- **Up to 3 photos** per strain — paste an image URL or upload from your device
  - URL images are downloaded, resized, and stored permanently, so they never break if the source disappears
  - Uploaded images are resized in the browser before saving
  - Click any photo to open a full-screen **lightbox** (with arrow-key navigation for multiple photos)
- **Per-strain notes** — free-form notes editable from a Notes button on each card

### Organize & review
- **Add form in a modal** — opens from a **+ Add Strain** button, keeping the browsing view clean
- **Edit and delete** existing entries (inline in grid, or via a modal in table view)
- **Grid / Table** view toggle
- **Search** by name, effects, or vendor, and **filter** by type
- **Dashboard stats**: total count, average price, average rating, and top-rated strain
- **Export** all strains to JSON or CSV

### Reference
- **Terpene Guide** modal — an overview of common terpenes, their aromas and effects, with callouts for which terpenes may **help** vs. **worsen anxiety** and why (educational, not medical advice)

### Appearance & security
- **Earthy light/dark themes** (GNOME 2 / Clearlooks-inspired) with a toggle; remembers your choice and honors your OS preference
- Color-coded strain type badges (Sativa = orange, Indica = blue, Hybrid/CBD = green)
- **Optional password lock** for the whole app via an `APP_PASSWORD` env var (login page + session cookie + Lock button)

## Setup

### Prerequisites

- **Node.js 20.9+** (Next.js 16 requires Node >= 20.9)
- **npm** (bundled with Node)
- A free **Neon Postgres** database

### 1. Create a Neon database

Sign up at [neon.tech](https://neon.tech) (free tier) and create a new project. Copy the connection string — it looks like:

```
postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

### 2. Set environment variables

Create a `.env.local` file for local development:

```bash
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"

# Optional: lock the app behind a password.
# If unset, the app is open (no login required).
APP_PASSWORD="your-password-here"
```

For Vercel deployment, add the same variables in **Project Settings → Environment Variables**
(`DATABASE_URL`, and optionally `APP_PASSWORD`). Set them for the **Production** environment
(and Preview/Development if you use those), then redeploy.

### 3. Install and run

```bash
npm install
npm run dev
```

The schema auto-creates and self-migrates on first DB access — no manual migrations needed. New
columns (photos, terpenes, notes, etc.) are added automatically via `ALTER TABLE ... ADD COLUMN
IF NOT EXISTS`, so existing data is never lost.

### npm scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local dev server at http://localhost:3000 |
| `npm run build` | Create a production build |
| `npm start` | Run the production build (after `npm run build`) |
| `npm run lint` | Run ESLint |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add `DATABASE_URL` (and optionally `APP_PASSWORD`) to the environment variables.
4. Deploy. Vercel will auto-detect Next.js.

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
vercel env add DATABASE_URL   # paste connection string when prompted
vercel env add APP_PASSWORD    # optional password lock
vercel --prod
```

> Note: Environment variable changes only apply to **new** deployments. After adding or changing
> a variable, trigger a redeploy.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-variable theming)
- **Neon Postgres** via `@neondatabase/serverless`
- **sharp** for server-side image download/resizing
- Middleware-based password gate
- Deployed on **Vercel**

## Architecture

```mermaid
flowchart TD
    U([User Browser])

    U -->|HTTPS request| MW{"Edge Middleware<br/>APP_PASSWORD set?"}
    MW -->|No password configured| APP
    MW -->|Valid auth cookie| APP
    MW -->|Missing / invalid cookie| LOGIN["/login page"]
    LOGIN -->|POST /api/login| AUTH["/api/login<br/>verify password<br/>set session cookie"]
    AUTH -->|Set-Cookie| U

    subgraph VERCEL["Vercel — Next.js 16 App Router"]
        APP["Pages &amp; Components<br/>(Server + Client)"]
        API["API Routes<br/>/api/strains /api/stats<br/>/api/export /api/logout"]
        SHARP["sharp<br/>download + resize images"]
        APP --> API
        API --> SHARP
    end

    APP -->|read strains on load| DB[("Neon Postgres<br/>strains table")]
    API -->|SQL over HTTPS| DB
    SHARP -->|fetch remote image| EXT(["External image URLs"])
```

### Request flow — adding a strain with photos

```mermaid
sequenceDiagram
    participant B as Browser
    participant M as Edge Middleware
    participant A as API /api/strains
    participant S as sharp
    participant N as Neon Postgres

    B->>M: POST /api/strains (fields + images)
    M->>M: Check auth cookie
    M->>A: Forward (authorized)
    A->>S: persistImages(urls + uploads)
    S->>S: Download URL images, resize to JPEG
    S-->>A: embedded data URLs
    A->>N: ensureSchema() + INSERT strain
    N-->>A: saved row
    A-->>B: 201 Created
    B->>B: Refresh list and close modal
```

- **Edge Middleware** gates every route against `APP_PASSWORD` (skipped entirely if the var is unset).
- **Server Components** load strains directly from Neon on page render; **Client Components** call the API routes for create/update/delete and live refreshes.
- **API Routes** run on Node, talk to Neon over HTTPS, and use **sharp** to download + resize any URL images so photos are stored permanently in the database.
- The **schema self-migrates** on each request via `ensureSchema()`.

## Data model

Strains are stored in a single `strains` table. Key columns:

| Column | Type | Notes |
| --- | --- | --- |
| `name`, `type`, `vendor`, `consumption`, `effects` | text | |
| `price` | numeric | |
| `rating` | int | 0–5 |
| `cbd_percent` | numeric | nullable |
| `makes_high` | boolean | psychoactive flag |
| `terpenes` | jsonb | array of up to 3 |
| `images` | jsonb | array of up to 3 (URLs or embedded data URLs) |
| `notes` | text | free-form notes |
| `created_at` | timestamptz | |

## Notes on image storage

Photos (both uploads and downloaded URL images) are stored directly in the database as resized
JPEG data. This keeps deployment zero-config (no separate blob store or tokens required). For
personal use with a handful of photos per strain this is fine. If you ever need full-resolution
originals or large galleries, the storage layer can be swapped for **Vercel Blob**.

## API reference

All routes live under `src/app/api`. Every route is protected by the middleware password gate
except `/api/login` and `/api/logout`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/strains` | List all strains |
| `POST` | `/api/strains` | Create a strain (downloads/resizes any image URLs) |
| `PUT` | `/api/strains` | Update a strain by `id` |
| `DELETE` | `/api/strains` | Delete a strain by `id` |
| `GET` | `/api/stats` | Dashboard aggregates (totals, averages, top-rated) |
| `GET` | `/api/export?format=json\|csv` | Download all strains |
| `POST` | `/api/login` | Verify `APP_PASSWORD`, set session cookie |
| `POST` | `/api/logout` | Clear the session cookie |

## Project structure

```
src/
├── middleware.ts            # Password gate for all routes
├── app/
│   ├── layout.tsx           # Root layout + no-flash theme init
│   ├── page.tsx             # Home (server component; loads strains)
│   ├── login/page.tsx       # Login screen
│   ├── globals.css          # Earthy light/dark theme tokens
│   ├── icon.svg             # Leaf favicon
│   └── api/                 # strains, stats, export, login, logout
├── components/
│   ├── App.tsx              # Client orchestrator + add-strain modal
│   ├── AddForm.tsx          # New-strain form
│   ├── StrainList.tsx       # Search, filter, grid/table toggle
│   ├── StrainCard.tsx       # Grid card + edit/notes/lightbox
│   ├── StrainTable.tsx      # Table view
│   ├── Dashboard.tsx        # Stat cards
│   ├── ImageInput.tsx       # Up-to-3 photo picker (URL or upload)
│   ├── Lightbox.tsx         # Full-screen photo viewer
│   ├── TerpeneInput.tsx     # Top-3 terpene picker w/ autocomplete
│   ├── TerpeneGuide.tsx     # Terpene reference modal
│   ├── ThemeToggle.tsx      # Light/dark switch
│   ├── LogoutButton.tsx     # Lock button
│   └── ExportButtons.tsx    # JSON/CSV download
└── lib/
    ├── db.ts                # Neon client, schema, CRUD, stats
    ├── images.ts            # Server-side image download + resize (sharp)
    ├── terpenes.ts          # Terpene reference data
    └── auth.ts              # Session token helper
```
