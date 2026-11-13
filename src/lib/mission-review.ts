export function isDevelopmentReviewMode(nodeEnv: string | undefined, reviewParam: string | string[] | undefined): boolean {
  return nodeEnv !== "production" && reviewParam === "1";
}

export function canEnterMission(status: string | undefined, reviewMode: boolean): boolean {
  return status !== "LOCKED" || reviewMode;
}
