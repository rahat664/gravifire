"use client";

import { useCallback, useState } from "react";

export type MissionSessionState = {
  missionId: string;
  phase: string;
  activeObjective: string | null;
  reviewedStations: string[];
  gateState: Record<string, boolean>;
  interactionLocked: boolean;
  activeReplay: string | null;
  activePanel: string | null;
};

export function createMissionSession(missionId: string): MissionSessionState {
  return { missionId, phase: "INSERTION", activeObjective: null, reviewedStations: [], gateState: {}, interactionLocked: false, activeReplay: null, activePanel: null };
}

/** Transient mission presentation only. It must never contain source data or campaign persistence. */
export function useMissionSession(missionId: string) {
  const [session, setSession] = useState<MissionSessionState>(() => createMissionSession(missionId));
  const resetSession = useCallback(() => setSession(createMissionSession(missionId)), [missionId]);
  const patchSession = useCallback((patch: Partial<MissionSessionState>) => setSession((current) => ({ ...current, ...patch })), []);
  const markStationReviewed = useCallback((stationId: string) => setSession((current) => ({ ...current, reviewedStations: Array.from(new Set([...current.reviewedStations, stationId])) })), []);
  return { session, patchSession, markStationReviewed, resetSession };
}
