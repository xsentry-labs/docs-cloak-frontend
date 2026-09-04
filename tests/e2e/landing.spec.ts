import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("renders the core sections and links to the app", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /remove pii from documents/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /how it works/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /simple, usage-based pricing/i })).toBeVisible();

    await page.getByRole("link", { name: "Try it free" }).first().click();
    await expect(page).toHaveURL(/\/app$/);
  });

  test("footer links to the legal pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();

    await page.goto("/");
    await page.getByRole("link", { name: "Terms of Service" }).click();
    await expect(page).toHaveURL(/\/terms$/);
    await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  });

  test("waitlist form rejects an invalid email and accepts a valid one", async ({ page }) => {
    await page.goto("/#waitlist");

    await page.getByTestId("waitlist-email-input").fill("not-an-email");
    await page.getByTestId("waitlist-submit").click();
    // Invalid emails are also blocked by the input's own type="email" validation, so
    // the form should simply not reach a success state.
    await expect(page.getByTestId("waitlist-success")).not.toBeVisible();

    await page.getByTestId("waitlist-email-input").fill("tester@example.com");
    await page.getByTestId("waitlist-submit").click();
    await expect(page.getByTestId("waitlist-success")).toBeVisible();
  });
});
