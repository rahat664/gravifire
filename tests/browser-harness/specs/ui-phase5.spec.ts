import { expect, test } from "@playwright/test";

test("compact research controls preserve filtering, ranking scores and keyboard access to explanations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experiments");
  const family = page.getByRole("combobox", { name: "Experiment family", exact: true });
  await family.selectOption("SAME-R");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article")).toContainText("109 EXPERIMENTAL-TABLE RECORDS");
  await page.screenshot({ path: test.info().outputPath("same-r-filter.png"), fullPage: true });
  await family.selectOption("ALL");
  await page.getByRole("textbox", { name: "Search", exact: true }).fill("unmatched-search-xyz");
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.goto("/experiments/bass-ii/runs/B1");
  await expect(page.getByText("Condition and outcome limits", { exact: true })).toBeVisible();
  await expect(page.getByText("Airflow and pressure are not reported in this normalized record.", { exact: true })).toBeVisible();
  await page.goto("/recommend/investigations");
  const firstCard = page.getByRole("article").first();
  const before = await firstCard.locator("span").first().innerText();
  const disclosure = firstCard.locator(".ranking-factor-details");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure.getByText("Mission relevance", { exact: true })).toBeVisible();
  await expect(firstCard.locator("span").first()).toHaveText(before);
  await page.screenshot({ path: test.info().outputPath("ranking-expanded.png"), fullPage: true });
  await page.keyboard.press("Enter");
  await expect(disclosure).not.toHaveAttribute("open", "");
});
