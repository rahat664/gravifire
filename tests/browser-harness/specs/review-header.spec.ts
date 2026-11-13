import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("review badge and NASA evidence link remain distinct, accessible, and clickable across PlayCanvas missions", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const missions = [
    { id: "m0", context: "m0" },
    { id: "m1", context: "m1" },
    { id: "m4", context: "m4" },
    { id: "m6", context: "m6" },
  ];

  for (const mission of missions) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/mission-control/play/${mission.id}?review=1`);
    const reviewBadge = page.getByTestId("playcanvas-review-badge");
    const scienceLink = page.getByRole("link", { name: /Open NASA evidence dashboard/ });
    await expect(reviewBadge).toBeVisible({ timeout: 30_000 });
    await expect(scienceLink).toBeVisible();

    for (const viewport of [
      { label: "desktop", width: 1440, height: 1000 },
      { label: "mobile", width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const badgeBox = await reviewBadge.boundingBox();
      const linkBox = await scienceLink.boundingBox();
      expect(badgeBox, `${mission.id} ${viewport.label} badge box`).not.toBeNull();
      expect(linkBox, `${mission.id} ${viewport.label} link box`).not.toBeNull();
      const overlaps = badgeBox!.x < linkBox!.x + linkBox!.width
        && badgeBox!.x + badgeBox!.width > linkBox!.x
        && badgeBox!.y < linkBox!.y + linkBox!.height
        && badgeBox!.y + badgeBox!.height > linkBox!.y;
      expect(overlaps, `${mission.id} ${viewport.label} badge must not cover the evidence link`).toBe(false);
      expect(linkBox!.height, `${mission.id} ${viewport.label} touch target height`).toBeGreaterThanOrEqual(44);

      const centerIsLink = await scienceLink.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest("a") === element;
      });
      expect(centerIsLink, `${mission.id} ${viewport.label} link hit target`).toBe(true);
      await expect(reviewBadge).toHaveCSS("color", "rgb(242, 199, 128)");
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      let linkReachedByKeyboard = false;
      for (let tab = 0; tab < 16 && !linkReachedByKeyboard; tab += 1) {
        await page.keyboard.press("Tab");
        linkReachedByKeyboard = await scienceLink.evaluate((element) => document.activeElement === element);
      }
      expect(linkReachedByKeyboard, `${mission.id} ${viewport.label} link is keyboard reachable`).toBe(true);
      await expect(scienceLink).toBeFocused();
      await expect(scienceLink).toHaveCSS("outline-style", "solid");

      const axe = await new AxeBuilder({ page })
        .include(".playcanvas-science-header")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(axe.violations.map((item) => `${item.id}: ${item.help}`), `${mission.id} ${viewport.label} science header accessibility`).toEqual([]);
      await testInfo.attach(`${mission.id}-${viewport.label}-science-header.png`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    await scienceLink.click();
    await expect(page).toHaveURL(/\/dashboard\?/);
    expect(new URL(page.url()).searchParams.get("gameMission")).toBe(mission.context);
    await expect(page.getByRole("heading", { name: "Mission fire evidence dashboard" })).toBeVisible();
  }

  await page.goto("/experiments");
  await expect(page.getByText("VERIFIED · 8 EXPERIMENTAL-TABLE RECORDS")).toBeVisible();
  await expect(page.getByText("VERIFIED · 109 EXPERIMENTAL-TABLE RECORDS")).toBeVisible();
  await expect(page.getByText(/row count is not a count of detections/i).first()).toBeVisible();
  await expect(page.getByText("VERIFIED · 8 CONFIGURATION ENVELOPES")).toBeVisible();
  await page.goto("/recommend/investigations");
  await expect(page.getByText("109 experimental-table records")).toBeVisible();
  await expect(page.getByText("8 configuration envelopes")).toBeVisible();
});
