import { expect, test } from "@playwright/test";
import { sampleDocumentPath } from "./fixtures";

async function reachExportStep(page: import("@playwright/test").Page) {
  await page.goto("/app");
  await page.setInputFiles('[data-testid="file-input"]', sampleDocumentPath());
  await page.getByTestId("detect-button").click();
  await expect(page.getByText("Review detected entities")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("continue-to-export").click();
  await expect(page.getByText("Ready to export")).toBeVisible();
}

test("rejects a too-short password", async ({ page }) => {
  await reachExportStep(page);
  await page.getByTestId("protect-original-checkbox").check();
  await page.getByTestId("protect-password-input").fill("short");
  await page.getByTestId("protect-confirm-password-input").fill("short");
  await page.getByTestId("generate-export-button").click();
  await expect(page.getByTestId("protect-password-error")).toContainText(/at least/i);
});

test("rejects mismatched passwords", async ({ page }) => {
  await reachExportStep(page);
  await page.getByTestId("protect-original-checkbox").check();
  await page.getByTestId("protect-password-input").fill("correcthorsebattery");
  await page.getByTestId("protect-confirm-password-input").fill("differentpassword");
  await page.getByTestId("generate-export-button").click();
  await expect(page.getByTestId("protect-password-error")).toContainText(/don't match/i);
});

test("produces a second download link for the protected original", async ({ page }) => {
  await reachExportStep(page);
  await page.getByTestId("protect-original-checkbox").check();
  await page.getByTestId("protect-password-input").fill("correcthorsebattery");
  await page.getByTestId("protect-confirm-password-input").fill("correcthorsebattery");
  await page.getByTestId("generate-export-button").click();

  await expect(page.getByTestId("export-done-view")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("download-redacted-link")).toBeVisible();
  const originalHref = await page.getByTestId("download-original-link").getAttribute("href");
  expect(originalHref).toMatch(/\/v1\/documents\//);
});
