import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const outputDir = "artifacts/screenshots";

function captureBrowserErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function screenshot(page: Page, name: string) {
  await mkdir(outputDir, { recursive: true });
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true, animations: "disabled" });
}

async function auditA11y(page: Page, name: string) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await mkdir("artifacts/axe", { recursive: true });
  await writeFile(`artifacts/axe/${name}.json`, JSON.stringify(results, null, 2));
  await test.info().attach(`axe-${name}.json`, { body: JSON.stringify(results, null, 2), contentType: "application/json" });
  expect(results.violations.map((item) => `${item.id}: ${item.help}`), name).toEqual([]);
}

test("lunar prevention: rank, inspect B1, compare source conditions and follow evidence gaps into EMBER", async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  let axeViolations: string[] = [];
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Mission fire evidence dashboard" })).toBeVisible();

  await page.getByRole("combobox", { name: "Mission environment" }).selectOption("LUNAR_HABITAT");
  await page.getByRole("radio", { name: "Fire Prevention" }).check();
  const ranked = page.getByRole("heading", { name: "Relevant NASA investigations" });
  await expect(ranked).toBeVisible();
  await expect(page.getByText("NASA Investigation Relevance v1")).toBeVisible();
  const bassCard = page.getByRole("article").filter({ hasText: /BASS-II\s*·\s*PSI-25/ });
  await expect(bassCard).toContainText("PSI-25");
  await expect(bassCard).toContainText("VERIFIED · INGESTED");
  await bassCard.getByRole("button", { name: /Open investigation evidence|Selected/ }).click();

  await expect(page.locator("#investigation-evidence-heading")).toHaveText("Burning and Suppression of Solids II");
  await page.getByText("Add hypothetical mission conditions (optional)").click();
  await page.getByRole("spinbutton", { name: /Oxygen fraction/ }).fill("22.2");
  const recordSelect = page.getByRole("combobox", { name: "Select a verified source record" });
  await expect(recordSelect).toBeVisible();
  const b1 = await recordSelect.locator("option").allTextContents();
  const b1Option = b1.find((option) => /· B1 ·/.test(option));
  expect(b1Option, `B1 option exists; options were ${b1.join(" | ")}`).toBeTruthy();
  await recordSelect.selectOption({ label: b1Option! });

  const oxygenRow = page.locator("div.grid").filter({ has: page.getByText("Oxygen fraction", { exact: true }) }).filter({ hasText: "NASA:" }).first();
  await expect(oxygenRow).toContainText("NASA: 22.2 %");
  await expect(oxygenRow).toContainText("Mission: 22.2 %");
  await expect(oxygenRow.getByText("MATCHED", { exact: true })).toBeVisible();
  const gravityRow = page.locator("div.grid").filter({ has: page.getByText("Gravity", { exact: true }) }).filter({ hasText: "NASA:" }).first();
  await expect(gravityRow.getByText("MISMATCHED", { exact: true })).toBeVisible();
  await expect(page.locator('p[role="alert"]')).toContainText("Microgravity evidence does not directly validate lunar or Martian partial-gravity behavior");

  const evidenceRecord = page.getByRole("region", { name: "Selected NASA evidence record" });
  await expect(evidenceRecord).toContainText("B1");
  await expect(evidenceRecord).toContainText("BASS-II");
  await expect(evidenceRecord).toContainText(/Source SHA-256: [a-f0-9]{64} · row 2/);
  await evidenceRecord.getByText("Inspect exact normalized source row and provenance").click();
  await expect(evidenceRecord.getByRole("link", { name: "NASA source" })).toHaveAttribute("href", /PSI-25/);
  await expect(evidenceRecord).toContainText("Calibrated initial O2 % by vol");
  await expect(evidenceRecord).toContainText("22.2");
  await expect(page.getByText("No normalized outcome observation is linked to this run.")).toBeVisible();
  await expect(page.getByText(/No NASA certification or material-safety conclusion/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Research limitations and next experiment direction" })).toBeVisible();
  await screenshot(page, "dashboard-lunar-prevention-b1-desktop");

  await page.setViewportSize({ width: 768, height: 1024 });
  await screenshot(page, "dashboard-lunar-prevention-b1-tablet");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Mission fire evidence dashboard" })).toBeVisible();
  await screenshot(page, "dashboard-lunar-prevention-b1-mobile");

  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await test.info().attach("axe-dashboard-mobile.json", { body: JSON.stringify(axe, null, 2), contentType: "application/json" });
  await mkdir("artifacts/axe", { recursive: true });
  await writeFile("artifacts/axe/dashboard-mobile.json", JSON.stringify(axe, null, 2));
  axeViolations = axe.violations.map((item) => `${item.id}: ${item.help}`);

  await evidenceRecord.getByRole("link", { name: "Open full evidence record and Evidence DNA" }).click();
  await expect(page).toHaveURL(/\/experiments\/bass-ii\/runs\/B1$/);
  await expect(page.getByRole("heading", { name: /B1/ })).toBeVisible();
  await page.getByRole("link", { name: "Ask about this experiment" }).click();
  await expect(page).toHaveURL(/\/ask\?run=B1&investigation=bass-ii/);
  const askInput = page.getByPlaceholder(/Ask about a NASA experiment/);
  await askInput.fill("What don't we know about B1?");
  await page.getByRole("button", { name: "Ask GRAVIFIRE" }).click();
  await expect(page.getByText(/found 5 documented evidence gaps for BASS-II Test B1/)).toBeVisible();
  await expect(page.getByText("PSI-25:Test-B1").first()).toBeVisible();
  await expect(page.getByText("Limitations", { exact: true })).toBeVisible();
  expect(axeViolations).toEqual([]);
  await expect(browserErrors, "dashboard, record, and EMBER routes should not emit uncaught or console errors").toEqual([]);
});

test("EMBER preserves deterministic ranking explanations and scientific refusals", async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  await page.goto("/ask");
  const question = "Rank NASA investigations for lunar fire prevention";
  const input = page.getByPlaceholder(/Ask about a NASA experiment/);
  await input.fill(question);
  await page.getByRole("button", { name: "Ask GRAVIFIRE" }).click();
  const answer = page.getByText(/Research relevance ranking for LUNAR HABITAT prevention/i);
  await expect(answer).toBeVisible();
  await expect(answer).toContainText("Scores are reproduced from NASA Investigation Relevance v1");
  await expect(answer).toContainText("Mission relevance");
  await expect(answer).toContainText("Evidence completeness");
  const firstRankingAnswer = await answer.innerText();
  await input.fill(question);
  await page.getByRole("button", { name: "Ask GRAVIFIRE" }).click();
  await expect(page.getByText(firstRankingAnswer, { exact: true })).toBeVisible();
  await expect(page.getByText("GRAVIFIRE:NASA Investigation Relevance v1").first()).toBeVisible();

  await input.fill("Is PMMA safe for a lunar habitat?");
  await page.getByRole("button", { name: "Ask GRAVIFIRE" }).click();
  await expect(page.getByText(/cannot certify a material or habitat as fire-safe/)).toBeVisible();
  await expect(page.getByText("EVIDENCE INSUFFICIENT")).toBeVisible();

  await input.fill("Which NASA tests measured fire in lunar partial gravity?");
  await page.getByRole("button", { name: "Ask GRAVIFIRE" }).click();
  await expect(page.getByText(/does not contain a direct lunar or Martian partial-gravity fire experiment record/)).toBeVisible();
  await expect(page.getByText("EVIDENCE INSUFFICIENT")).toBeVisible();
  await expect(browserErrors).toEqual([]);
});

test("navigation routes, game-science links, and campaign state remain compatible", async ({ page }) => {
  const campaignState = JSON.stringify({
    schemaVersion: 2,
    activeMissionId: "m0",
    missions: Object.fromEntries(["m0", "m1", "m4", "m6"].map((missionId) => [missionId, {
      missionId, status: "AVAILABLE", currentBeat: "BRIEFING", selectedChoices: {},
      configuration: { airflow: 20, direction: "Concurrent", oxygen: 21 }, verdictViewed: false,
      fieldManualUnlocks: [], playerPredictions: [], gapLog: [],
    }])),
    predictions: [], decisions: [], gapLog: [], manual: [], verdictHistory: [], challengeLinks: [],
  });
  await page.addInitScript((serialized) => localStorage.setItem("gravifire:mission-control:campaign:v2", serialized), campaignState);
  const browserErrors = captureBrowserErrors(page);
  for (const route of ["/experiments", "/applicability", "/recommend/investigations", "/dashboard", "/mission-control", "/mission-control/dossier", "/mission-control/manual"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("body")).not.toContainText("Application error");
    await auditA11y(page, `route-${route.replaceAll("/", "-").replace(/^-/, "")}`);
  }

  await page.goto("/mission-control/dossier");
  await expect(page.getByRole("heading", { name: "AEGIS EVIDENCE DOSSIER" })).toBeVisible();
  await expect(page.getByRole("link", { name: "FREE SURVEY" })).toHaveAttribute("href", "/experiments");
  await expect(page.getByText("SAFFIRE-I S1 / S2")).toBeVisible();
  const m1Pc = await page.goto("/mission-control/play/m1-pc?review=1");
  expect(m1Pc?.status()).toBe(200);
  await expect(page.getByRole("link", { name: /Open NASA evidence dashboard/ })).toBeVisible({ timeout: 30_000 });

  const expected = {
    m0: { mission: "SPACECRAFT", objective: "DETECTION", gameMission: "m0" },
    m1: { mission: "SPACECRAFT", objective: "PREVENTION", investigation: "saffire-i", gameMission: "m1" },
    m4: { mission: "SPACECRAFT", objective: "PREVENTION", investigation: "saffire-ii", gameMission: "m4" },
    m6: { mission: "MARS_HABITAT", objective: "SUPPRESSION", investigation: "flex", gameMission: "m6" },
  } as const;
  for (const mission of ["m0", "m1", "m4", "m6"] as const) {
    await page.goto(`/mission-control/play/${mission}?review=1`);
    const scienceLink = page.getByRole("link", { name: /Open NASA evidence dashboard/ });
    await expect(scienceLink).toBeVisible({ timeout: 30_000 });
    if (mission === "m0") {
      const firstMissionBrief = page.getByRole("heading", { name: "LEARN THE FIELD GRAMMAR" });
      if (await firstMissionBrief.isVisible().catch(() => false)) {
        await page.getByRole("button", { name: /BEGIN M0/ }).click();
        await expect(firstMissionBrief).toBeHidden();
      }
      await scienceLink.focus();
      await page.keyboard.press("Escape");
      const pauseDialog = page.getByRole("dialog", { name: "PAUSED" });
      await expect(pauseDialog).toBeVisible();
      await expect(pauseDialog).toHaveAttribute("aria-modal", "true");
      const resumeButton = pauseDialog.getByRole("button", { name: "RESUME" });
      await expect(resumeButton).toBeFocused();
      await auditA11y(page, "mission-pause-dialog");
      await page.keyboard.press("Shift+Tab");
      await expect(pauseDialog.getByRole("link", { name: "RETURN TO MISSION CONTROL" })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(resumeButton).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(pauseDialog).toBeHidden();
      await expect(scienceLink).toBeFocused();
    }
    const href = await scienceLink.getAttribute("href");
    const target = new URL(href!, page.url());
    for (const [key, value] of Object.entries(expected[mission])) expect(target.searchParams.get(key)).toBe(value);
    await scienceLink.click();
    await page.waitForURL((url) => Object.entries(expected[mission]).every(([key, value]) => url.searchParams.get(key) === value));
    const current = new URL(page.url());
    for (const [key, value] of Object.entries(expected[mission])) expect(current.searchParams.get(key)).toBe(value);
    await expect(page.getByRole("heading", { name: "Mission fire evidence dashboard" })).toBeVisible();
    if (mission === "m0") await expect(page.getByText(/No scientific verdict is assigned to the fictional M0 alarm/)).toBeVisible();
    if (mission === "m1") {
      await expect(page.getByText("PSI-98:Sample-S1")).toBeVisible();
      await expect(page.getByText(/ISV Vesta campaign is fictional/)).toBeVisible();
    }
    if (mission === "m4") {
      await expect(page.getByText("PSI-99:Sample-2-1")).toBeVisible();
      await expect(page.getByText(/Aegis gasket scenario is fictional/)).toBeVisible();
    }
    if (mission === "m6") {
      await expect(page.getByText("PSI-69:Test-2")).toBeVisible();
      await expect(page.getByText(/do not validate Martian partial-gravity outcomes/)).toBeVisible();
    }
  }
  await expect.poll(() => page.evaluate(() => localStorage.getItem("gravifire:mission-control:campaign:v2"))).toBe(campaignState);
  expect(browserErrors).toEqual([]);
});

test("dashboard form controls are keyboard reachable with visible focus and tablet/mobile layouts do not overflow", async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    label: document.activeElement instanceof HTMLElement ? document.activeElement.innerText || document.activeElement.getAttribute("aria-label") : null,
  }));
  expect(firstFocus.tag).not.toBe("BODY");
  await page.getByRole("radio", { name: "Fire Detection" }).check();
  await expect(page.getByText(/Pillar scope: Smoke and aerosol detection/)).toBeVisible();
  await page.getByRole("radio", { name: "Fire Suppression" }).check();
  await expect(page.getByText(/Pillar scope: .*droplet combustion and extinguishment/i)).toBeVisible();
  await page.getByRole("radio", { name: "Fire Prevention" }).check();
  await expect(page.getByText(/Pillar scope: Solid material flammability/)).toBeVisible();
  const missionSelect = page.getByRole("combobox", { name: "Mission environment" });
  await missionSelect.focus();
  const focusStyle = await missionSelect.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, borderColor: style.borderColor };
  });
  expect(focusStyle.borderColor).not.toBe("rgb(255, 255, 255)");
  for (const viewport of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await auditA11y(page, "dashboard-responsive-controls-mobile");
  expect(browserErrors).toEqual([]);
});
