import { expect, test } from "@playwright/test";

test("operations HUD preserves pause focus, evidence hit targets and an unobstructed center", async ({ page }) => {
  test.setTimeout(180_000);
  for (const mission of ["m0", "m1", "m4", "m6"]) {
    await page.goto(`/mission-control/play/${mission}?review=1`);
    const objective = page.locator(".playcanvas-objective");
    const evidence = page.getByRole("link", { name: /Open NASA evidence dashboard/ });
    await expect(objective).toBeVisible();
    for (const viewport of [{ width: 1920, height: 1080 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      const a = await objective.boundingBox();
      const b = await page.locator(".playcanvas-science-header").boundingBox();
      expect(a).not.toBeNull(); expect(b).not.toBeNull();
      const overlaps = a!.x < b!.x + b!.width && a!.x + a!.width > b!.x && a!.y < b!.y + b!.height && a!.y + a!.height > b!.y;
      expect(overlaps, `${mission} ${viewport.width} objective/header overlap`).toBe(false);
      expect(await evidence.evaluate(element => { const r = element.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest("a") === element; })).toBe(true);
      expect(await page.evaluate(() => !document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest(".playcanvas-science-header,.playcanvas-objective,.mission-control-hints"))).toBe(true);
    }
    await evidence.focus();
    await page.keyboard.press("Escape");
    const dialog = page.getByRole("dialog", { name: "PAUSED", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "RESUME", exact: true })).toBeFocused();
    await dialog.getByRole("button", { name: "CONTROLS", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "HIDE CONTROLS", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(evidence).toBeFocused();
  }
});
