import { devices, expect, test } from "@playwright/test";
import { sampleDocumentPath } from "./fixtures";

test.use({ ...devices["Pixel 7"] });

test("the redact flow works on a mobile viewport", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText(/drag & drop a document/i)).toBeVisible();

  await page.setInputFiles('[data-testid="file-input"]', sampleDocumentPath());
  await expect(page.getByText("Choose PII categories to redact")).toBeVisible();

  await page.getByTestId("detect-button").click();
  await expect(page.getByText("Review detected entities")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("entity-row").first()).toBeVisible();

  await page.getByTestId("continue-to-export").click();
  await page.getByTestId("generate-export-button").click();
  await expect(page.getByTestId("export-done-view")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("download-redacted-link")).toBeVisible();
});
