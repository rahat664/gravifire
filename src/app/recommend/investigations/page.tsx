import type { Metadata } from "next";
import InvestigationRankingExplorer from "@/components/recommendations/InvestigationRankingExplorer";

export const metadata: Metadata = { title: "Investigation Relevance Ranking | GRAVIFIRE", description: "Deterministically rank NASA combustion investigations by mission and question relevance." };

export default function InvestigationRankingPage() {
  return <InvestigationRankingExplorer />;
}
