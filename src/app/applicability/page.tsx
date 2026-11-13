import type { Metadata } from "next";
import ApplicabilityExplorer from "@/components/applicability/ApplicabilityExplorer";

export const metadata: Metadata = { title: "Evidence Applicability | GRAVIFIRE", description: "Compare source-reported NASA combustion investigation conditions with explicitly hypothetical mission conditions." };

export default function ApplicabilityPage() {
  return <ApplicabilityExplorer />;
}
