import * as Sentry from "@sentry/nextjs";

// NEXT_PUBLIC_SENTRY_DSN (not SENTRY_DSN) since this file ships to the browser. A
// no-op when unset.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.1,
});
