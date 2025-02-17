import { ExecutionPhase } from "@prisma/client";

type phase = Pick<ExecutionPhase, "creditsConsumed">;

export function GetPhasesTotalCost(phases: phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}
