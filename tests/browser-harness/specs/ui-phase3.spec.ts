import { expect, test } from "@playwright/test";

test("scientific console labels, failure feedback and provenance disclosure remain keyboard accessible", async ({ page }) => {
  await page.goto("/ask");
  await page.route("**/api/ask", route => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
  await page.getByRole("textbox", { name: "Scientific evidence question" }).fill("What evidence supports B1?");
  await page.getByRole("button", { name: "Ask GRAVIFIRE", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("could not be completed");
  await page.screenshot({ path: test.info().outputPath("ember-error.png"), fullPage: true });
  await page.goto("/experiments/bass-ii/runs/B1");
  const dna = page.getByRole("region", { name: "Evidence DNA provenance" });
  const disclosure = dna.locator("summary");
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(dna.getByText("Source record identifier", { exact: true })).toBeVisible();
  await expect(dna.getByRole("link", { name: "Open NASA source for BASS-II record B1" })).toHaveAttribute("href", /PSI-25/);
  await page.screenshot({ path: test.info().outputPath("dna-expanded.png"), fullPage: true });
  await page.goto("/mission-control/dossier");
  await page.getByRole("link", { name: "SCIENCE DASHBOARD", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
