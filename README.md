This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It's the frontend for [docs-cloak](https://github.com/xsentry-labs/docs-cloak), the PII
redaction API — the `/app` redactor flow calls that backend directly (see
`NEXT_PUBLIC_API_URL` below), it isn't a self-contained mock.

## Environment variables

Copy `.env.local.example` to `.env.local` and adjust as needed:

| var | default | description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | base URL of the docs-cloak backend |
| `NEXT_PUBLIC_MAX_UPLOAD_BYTES` | 25MB | client-side upload size guard; should mirror the backend's `MAX_UPLOAD_BYTES` |
| `SENTRY_DSN` | unset | server-side Sentry error tracking; a no-op when unset |
| `NEXT_PUBLIC_SENTRY_DSN` | unset | browser-side Sentry error tracking; a no-op when unset |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running the e2e suite

The Playwright suite in `tests/e2e/` exercises the real app against a real running
backend — it's not mocked — covering the landing page, the full upload → detect →
review → export flow, the password-protect-original option, a mobile viewport, and edge
cases (unsupported file type, empty file, oversized file, zero-entities-found).

1. Clone and run [docs-cloak](https://github.com/xsentry-labs/docs-cloak) locally
   (`uvicorn app.main:app --port 3000`; needs `tesseract-ocr` installed) and set
   `ALLOWED_ORIGINS=http://localhost:3100` so it accepts requests from the suite's dev
   server.
2. `npm run test:e2e` — this starts its own `next dev` on port 3100 (see
   `playwright.config.ts`) pointed at `NEXT_PUBLIC_API_URL` (default
   `http://localhost:3000`).

CI (`.github/workflows/e2e.yml`) does both steps itself: it checks out `docs-cloak` into
a sibling directory, installs `tesseract-ocr`, and starts the backend before running the
suite. If that repo is private, add a fine-grained PAT with read access to it as the
`DOCS_CLOAK_REPO_TOKEN` secret in this repo's settings.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
