"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowPhaseDetails(phaseId: string) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("unauthenticated");
    }

    const phase = await prisma.executionPhase.findUnique({
      where: {
        id: phaseId,
        execution: {
          userId,
        },
      },
      include: {
        logs: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!phase) {
      console.error(`Phase not found: ${phaseId}`);
    }

    return phase;
  } catch (error) {
    console.error("Error fetching workflow phase details:", error);
    throw error; // Rethrow to ensure the error is handled upstream
  }
}
