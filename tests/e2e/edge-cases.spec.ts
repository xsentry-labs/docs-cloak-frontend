import { expect, test } from "@playwright/test";
import { emptyFilePath, noPiiDocumentPath, oversizedFilePath, unsupportedFilePath } from "./fixtures";

test("rejects an unsupported file type before uploading anything", async ({ page }) => {
  await page.goto("/app");
  await page.setInputFiles('[data-testid="file-input"]', unsupportedFilePath());
  await expect(page.getByTestId("upload-error")).toContainText(/unsupported file type/i);
  // Should not have advanced to the category step.
  await expect(page.getByText("Choose PII categories to redact")).not.toBeVisible();
});

test("rejects an empty file", async ({ page }) => {
  await page.goto("/app");
  await page.setInputFiles('[data-testid="file-input"]', emptyFilePath());
  await expect(page.getByTestId("upload-error")).toContainText(/empty/i);
});

test("rejects a file over the configured size limit", async ({ page }) => {
  await page.goto("/app");
  await page.setInputFiles('[data-testid="file-input"]', oversizedFilePath());
  await expect(page.getByTestId("upload-error")).toContainText(/over the/i);
});

test("a document with no detectable PII still completes with zero entities", async ({ page }) => {
  await page.goto("/app");
  await page.setInputFiles('[data-testid="file-input"]', noPiiDocumentPath());
  await page.getByTestId("detect-button").click();

  await expect(page.getByText("Review detected entities")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("no-entities-message")).toBeVisible();
  await expect(page.getByTestId("entity-row")).toHaveCount(0);

  await page.getByTestId("continue-to-export").click();
  await page.getByTestId("generate-export-button").click();
  await expect(page.getByTestId("export-done-view")).toBeVisible({ timeout: 20_000 });
});
