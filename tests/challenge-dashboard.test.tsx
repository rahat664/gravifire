import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ChallengeDashboard from "@/components/dashboard/ChallengeDashboard";

function renderDashboard(): string {
  return renderToStaticMarkup(createElement(ChallengeDashboard));
}

describe("mission fire evidence dashboard component", () => {
  it("renders keyboard-operable mission and objective selectors", () => {
    const html = renderDashboard();
    expect(html).toContain("Mission environment");
    expect(html).toContain("Spacecraft");
    expect(html).toContain("Lunar habitat");
    expect(html).toContain("Mars habitat");
    expect(html).toContain("Pressurized rover");
    expect(html).toContain('type="radio"');
    expect(html).toContain("Fire Prevention");
    expect(html).toContain("Fire Detection");
    expect(html).toContain("Fire Suppression");
  });

  it("renders ranked NASA sources with integration status and explanations", () => {
    const html = renderDashboard();
    expect(html).toContain("Relevant NASA investigations");
    expect(html).toContain("NASA PSI investigation");
    expect(html).toContain("VERIFIED · INGESTED");
    expect(html).toContain("relevance index");
    expect(html).toContain("NASA Investigation Relevance v1");
    expect(html).toContain("129 run records");
    expect(html).not.toContain("109 validated records");
    expect(html).not.toContain("8 validated records");
  });

  it("opens an actual normalized record and links to the existing Evidence DNA route", () => {
    const html = renderDashboard();
    expect(html).toContain("Investigation evidence");
    expect(html).toContain("NASA normalized experiment record · B1");
    expect(html).toContain("Inspect exact normalized source row and provenance");
    expect(html).toContain("Source SHA-256:");
    expect(html).toContain("Open full evidence record and Evidence DNA");
    expect(html).toContain("/experiments/bass-ii/runs/B1");
  });

  it("renders condition comparisons and refuses to overstate their interpretation", () => {
    const html = renderDashboard();
    expect(html).toContain("Condition interpretation");
    expect(html).toContain("MATCHED");
    expect(html).toContain("psi.nasa.gov/physci/repo/data/investigations/PSI-25");
    expect(html).toContain("does not transfer outcomes or establish safety");
    expect(html).toContain("No NASA certification or material-safety conclusion");
  });

  it("flags microgravity evidence when shown for a lunar partial-gravity mission", () => {
    const html = renderToStaticMarkup(createElement(ChallengeDashboard, { initialMission: "LUNAR_HABITAT", initialInvestigationId: "bass-ii" }));
    expect(html).toContain("Microgravity evidence does not directly validate lunar or Martian partial-gravity behavior");
    expect(html).toContain("MISMATCHED");
  });

  it("shows a reference-only gap without fabricating source records", () => {
    const html = renderToStaticMarkup(createElement(ChallengeDashboard, { initialInvestigationId: "bass" }));
    expect(html).toContain("REFERENCE ONLY");
    expect(html).toContain("no verified normalized experiment records");
    expect(html).toContain("verify and ingest a primary NASA experimental table");
    expect(html).not.toContain("NASA normalized experiment record · PSI-26");
  });

  it("keeps the Virtual Lab, advanced ranking, and Evidence Explorer reachable", () => {
    const html = renderDashboard();
    expect(html).toContain("href=\"/lab\"");
    expect(html).toContain("href=\"/recommend/investigations\"");
    expect(html).toContain("href=\"/experiments\"");
  });
});
