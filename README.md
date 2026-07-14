# Strain Tracker

A personal cannabis strain tracking app built with Next.js (App Router), Tailwind CSS, and Neon Postgres. Deploy to Vercel for free.

## Features

- Add strains with name, type, effects, price, image URL, and 1–5 star rating
- Edit and delete existing entries
- Search and filter by type
- Dashboard stats: total count, average price, average rating, top-rated strain
- Export all strains to JSON or CSV

## Setup

### 1. Create a Neon database

Sign up at [neon.tech](https://neon.tech) (free tier) and create a new project. Copy the connection string — it looks like:

```
postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

### 2. Set the environment variable

Create a `.env.local` file for local development:

```bash
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
```

For Vercel deployment, add the same variable in **Project Settings → Environment Variables** as `DATABASE_URL`.

### 3. Install and run

```bash
npm install
npm run dev
```

The schema auto-creates on first DB access — no manual migration needed.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add `DATABASE_URL` to the environment variables (paste your Neon connection string).
4. Deploy. Vercel will auto-detect Next.js.

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
vercel env add DATABASE_URL  # paste connection string when prompted
vercel --prod
```