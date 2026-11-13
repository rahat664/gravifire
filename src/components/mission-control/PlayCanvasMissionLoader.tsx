"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import GameShell from "@/components/mission-control/GameShell";
import { campaignMissions } from "@/data/missions";
import { CAMPAIGN_STORAGE_KEY, parseCampaignState } from "@/lib/mission-state";
import { canEnterMission } from "@/lib/mission-review";
import PlayCanvasMissionChrome from "@/components/mission-control/PlayCanvasMissionChrome";

const PlayCanvasM0Pilot = dynamic(() => import("@/components/mission-control/PlayCanvasM0Pilot"), { ssr: false, loading: () => <Loading title="M0 · TWO SECONDS OF SMOKE" status="LOADING INCIDENT RESPONSE" /> });
const PlayCanvasM1Pilot = dynamic(() => import("@/components/mission-control/PlayCanvasM1Pilot"), { ssr: false, loading: () => <Loading title="M1 · SIBAL: THE STANDARD" status="LOADING RESEARCH BAY" /> });
const PlayCanvasM4Pilot = dynamic(() => import("@/components/mission-control/PlayCanvasM4Pilot"), { ssr: false, loading: () => <Loading title="M4 · SILICONE: THE GASKET PARADOX" status="LOADING MATERIALS LAB" /> });
const PlayCanvasM6Pilot = dynamic(() => import("@/components/mission-control/PlayCanvasM6Pilot"), { ssr: false, loading: () => <Loading title="M6 · THE AEGIS LIST & THE LOCKED DOOR" status="LOADING EVIDENCE BOUNDARY" /> });

function Loading({ title, status }: { title: string; status: string }) { return <div className="game-loading"><div><p className="game-loading__brand">GRAVIFIRE</p><p className="game-loading__title">{title}</p><p className="game-loading__status">{status}</p><p className="game-loading__sub">PLAYCANVAS</p></div></div>; }

class PlayCanvasFailureBoundary extends Component<{ missionId: "m0" | "m1" | "m4" | "m6"; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { if (process.env.NODE_ENV !== "production") console.error(`[PlayCanvas ${this.props.missionId.toUpperCase()}] initialization failed`, error, info.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    const title = this.props.missionId === "m0" ? "M0 · TWO SECONDS OF SMOKE" : this.props.missionId === "m1" ? "M1 · SIBAL: THE STANDARD" : this.props.missionId === "m4" ? "M4 · SILICONE: THE GASKET PARADOX" : "M6 · THE AEGIS LIST & THE LOCKED DOOR";
    return <div className="game-mobile-fallback"><div className="max-w-lg"><p className="text-xs uppercase tracking-[0.2em] text-amber-200">PLAYCANVAS INITIALIZATION FAILED</p><h1 className="mt-3 text-2xl">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-400">The PlayCanvas mission view could not initialize. The legacy renderer was not substituted.</p>{process.env.NODE_ENV !== "production" && <pre className="mt-4 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-left text-xs text-rose-200">{this.state.error.message}</pre>}</div></div>;
  }
}

type MissionId = "m0" | "m1" | "m4" | "m6";
type ReviewStage = "corridor" | "incident" | "response" | "archive" | "replay" | "analysis" | "material" | "ground" | "lowg" | "samples" | "manifest" | "evidence" | "airlock" | "boundary" | "refusal";

export default function PlayCanvasMissionLoader({ missionId, reviewMode, reviewStage }: { missionId: MissionId; reviewMode: boolean; reviewStage?: ReviewStage }) {
  const [access, setAccess] = useState<"CHECKING" | "GRANTED" | "LOCKED">(reviewMode ? "GRANTED" : "CHECKING");
  useEffect(() => { const timer = window.setTimeout(() => { if (reviewMode) { setAccess("GRANTED"); return; } const saved = parseCampaignState(window.localStorage.getItem(CAMPAIGN_STORAGE_KEY), campaignMissions); setAccess(canEnterMission(saved.missions[missionId]?.status, false) ? "GRANTED" : "LOCKED"); }, 0); return () => window.clearTimeout(timer); }, [missionId, reviewMode]);
  const title = missionId === "m0" ? "M0 · TWO SECONDS OF SMOKE" : missionId === "m1" ? "M1 · SIBAL: THE STANDARD" : missionId === "m4" ? "M4 · SILICONE: THE GASKET PARADOX" : "M6 · THE AEGIS LIST & THE LOCKED DOOR";
  if (access === "CHECKING") return <GameShell><Loading title={title} status="CHECKING CAMPAIGN ACCESS" /></GameShell>;
  if (access === "LOCKED") return <GameShell><main className="game-mobile-fallback"><div className="max-w-md"><p className="text-xs uppercase tracking-[0.2em] text-amber-200">MISSION LOCKED</p><h1 className="mt-3 text-2xl">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-400">Complete the previous campaign mission before entering this mission.</p></div></main></GameShell>;
  const pilot = missionId === "m0" ? <PlayCanvasM0Pilot reviewStage={reviewStage === "corridor" || reviewStage === "incident" || reviewStage === "response" || reviewStage === "archive" ? reviewStage : undefined} /> : missionId === "m1" ? <PlayCanvasM1Pilot reviewStage={reviewStage === "replay" || reviewStage === "analysis" ? reviewStage : undefined} /> : missionId === "m4" ? <PlayCanvasM4Pilot reviewStage={reviewStage === "material" || reviewStage === "ground" || reviewStage === "lowg" || reviewStage === "samples" || reviewStage === "analysis" ? reviewStage : undefined} /> : <PlayCanvasM6Pilot reviewStage={reviewStage === "manifest" || reviewStage === "evidence" || reviewStage === "airlock" || reviewStage === "boundary" || reviewStage === "refusal" ? reviewStage : undefined} />;
  return <GameShell><PlayCanvasMissionChrome missionId={missionId} tutorial={!reviewMode && missionId === "m0"} reviewMode={reviewMode}><PlayCanvasFailureBoundary missionId={missionId}>{pilot}</PlayCanvasFailureBoundary></PlayCanvasMissionChrome></GameShell>;
}
