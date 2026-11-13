import Link from "next/link";
import { gameScienceDashboardHref, type GameScienceMissionId } from "@/lib/game-science-context";

export default function MissionScienceLink({ missionId }: { missionId: GameScienceMissionId }) {
  const isFictionalIncident = missionId === "m0";
  return <aside aria-label="NASA evidence dashboard navigation" className="mission-science-link">
    <Link href={gameScienceDashboardHref(missionId)} className="block min-h-11 rounded-lg border border-cyan-200/30 bg-[#050a0d]/90 px-3 py-2 text-left text-white shadow-lg backdrop-blur-sm transition hover:border-cyan-200/60 hover:bg-[#071116] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">Open NASA evidence dashboard ↗</span>
      <span className="mt-1 block text-[9px] uppercase tracking-[0.1em] text-amber-100">{isFictionalIncident ? "Fictional incident · no matching NASA event" : "Campaign story is fictional · source records are real"}</span>
    </Link>
  </aside>;
}
