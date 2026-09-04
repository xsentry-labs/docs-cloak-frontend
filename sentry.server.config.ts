import * as Sentry from "@sentry/nextjs";

// A no-op when SENTRY_DSN is unset, so local dev and CI never report anywhere.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
