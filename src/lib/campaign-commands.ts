import type { MissionDefinition } from "@/features/mission-control/types";
import type { CampaignState, FieldManualEntry, MissionDecision, MissionProgress, PredictionRecord, CampaignGapLog } from "@/features/mission-control/types";
import { addDecision, addGap, addPrediction, completeMission, createInitialCampaign, parseCampaignState, serializeCampaignState, unlockManual, CAMPAIGN_STORAGE_KEY } from "@/lib/mission-state";

/** The only browser-storage boundary needed by campaign writers. Scientific data is never written here. */
export function campaignStore(definitions: MissionDefinition[]) {
  const load = (): CampaignState => parseCampaignState(typeof window === "undefined" ? null : window.localStorage.getItem(CAMPAIGN_STORAGE_KEY), definitions);
  const save = (state: CampaignState): CampaignState => { if (typeof window !== "undefined") window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, serializeCampaignState(state)); return state; };
  return {
    load,
    save,
    reset: () => save(createInitialCampaign(definitions)),
    recordPrediction: (state: CampaignState, value: PredictionRecord) => save(addPrediction(state, value)),
    recordDecision: (state: CampaignState, value: MissionDecision) => save(addDecision(state, value)),
    logGap: (state: CampaignState, value: CampaignGapLog) => save(addGap(state, value)),
    unlockFieldManual: (state: CampaignState, value: FieldManualEntry) => save(unlockManual(state, value)),
    complete: (state: CampaignState, missionId: string, nextMissionId?: string) => save(completeMission(state, missionId, nextMissionId)),
  };
}

export type CampaignStore = ReturnType<typeof campaignStore>;
export type { MissionProgress };
