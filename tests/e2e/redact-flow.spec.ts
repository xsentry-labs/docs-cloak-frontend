import { expect, test } from "@playwright/test";
import { sampleDocumentPath } from "./fixtures";

test("full upload -> detect -> review -> export happy path", async ({ page }) => {
  await page.goto("/app");

  await page.setInputFiles('[data-testid="file-input"]', sampleDocumentPath());
  await expect(page.getByText("Choose PII categories to redact")).toBeVisible();

  // /v1/redact is asynchronous (see docs-cloak's app/jobs.py) — the button disables
  // and shows a queued/detecting label while polling, then the review step lands.
  await page.getByTestId("detect-button").click();
  await expect(page.getByText("Review detected entities")).toBeVisible({ timeout: 20_000 });
  const entityRows = page.getByTestId("entity-row");
  await expect(entityRows).not.toHaveCount(0);

  // TXT uploads get a live block-redacted preview from the client-side text.
  const preview = page.locator("pre").first();
  await expect(preview).toContainText("█");
  await expect(preview).not.toContainText("john.smith@example.com");

  await page.getByTestId("continue-to-export").click();
  await expect(page.getByText("Ready to export")).toBeVisible();

  await page.getByTestId("generate-export-button").click();
  await expect(page.getByTestId("export-done-view")).toBeVisible({ timeout: 20_000 });

  const redactedHref = await page.getByTestId("download-redacted-link").getAttribute("href");
  expect(redactedHref).toMatch(/\/v1\/documents\//);
  await expect(page.getByTestId("download-original-link")).toHaveCount(0);
});
