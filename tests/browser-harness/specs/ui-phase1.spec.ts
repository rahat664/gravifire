import { expect, test } from "@playwright/test";

test("command navigation exposes the current route on desktop and all routes on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /GRAVIFIRE/ }).first()).toBeVisible();
  await expect(page.locator(".mission-nav__desktop-links a")).toHaveCount(5);
  await page.goto("/dashboard");
  await expect(page.locator(".mission-nav__desktop-links a[aria-current=page]")).toHaveAttribute("href", "/dashboard");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".mission-nav__menu");
  await menu.locator("summary").click();
  await expect(menu.locator("a")).toHaveCount(5);
  await expect(menu.getByRole("link", { name: "Evidence" })).toBeVisible();
  await menu.getByRole("link", { name: "Evidence" }).click();
  await expect(page).toHaveURL(/\/experiments$/);
  await expect(menu).not.toHaveAttribute("open", "");
});

test("dashboard keeps BASS-II source actions separated at desktop and mobile widths", async ({ page }) => {
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard");
    await page.getByRole("combobox", { name: "Mission environment" }).selectOption("LUNAR_HABITAT");
    const bassCard = page.getByRole("article").filter({ hasText: /BASS-II\s*·\s*PSI-25/ });
    await bassCard.getByRole("button", { name: /Open investigation evidence|Selected/ }).click();
    const evidenceRecord = page.getByRole("region", { name: "Selected NASA evidence record" });
    const evidenceAction = evidenceRecord.getByRole("link", { name: "Open full evidence record and Evidence DNA" });
    const nasaAction = evidenceRecord.getByRole("link", { name: "Open NASA Physical Sciences Informatics source" });
    await expect(evidenceAction).toBeVisible();
    await expect(nasaAction).toBeVisible();
    const first = await evidenceAction.boundingBox();
    const second = await nasaAction.boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    const intersects = first!.x < second!.x + second!.width && second!.x < first!.x + first!.width && first!.y < second!.y + second!.height && second!.y < first!.y + first!.height;
    expect(intersects).toBe(false);
    await expect(page.getByText(/Microgravity evidence does not directly validate lunar or Martian partial-gravity behavior/)).toBeVisible();
  }
});
