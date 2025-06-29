"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetNodeExecutionDetails(phaseId: string) {
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
      throw new Error("Phase not found");
    }

    let parsedInputs = {};
    let parsedOutputs = {};
    let nodeId = "";

    try {
      // Parse the inputs if available
      if (phase.inputs) {
        parsedInputs = JSON.parse(phase.inputs);
      }

      // Parse the outputs if available
      if (phase.outputs) {
        parsedOutputs = JSON.parse(phase.outputs);
      }

      // Extract the nodeId from the node data
      const nodeData = JSON.parse(phase.node);
      nodeId = nodeData.id;
    } catch (error) {
      console.error("Error parsing phase data:", error);
    }

    // Calculate execution duration
    let duration = null;
    if (phase.startedAt && phase.completedAt) {
      duration = phase.completedAt.getTime() - phase.startedAt.getTime();
    }

    return {
      id: phase.id,
      status: phase.status,
      name: phase.name,
      nodeId,
      startedAt: phase.startedAt,
      completedAt: phase.completedAt,
      duration,
      inputs: parsedInputs,
      outputs: parsedOutputs,
      logs: phase.logs.map((log) => ({
        id: log.id,
        level: log.logLevel,
        message: log.message,
        timestamp: log.timestamp,
      })),
    };
  } catch (error) {
    console.error("Error fetching node execution details:", error);
    throw error;
  }
}
