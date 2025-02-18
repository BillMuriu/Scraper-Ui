import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { LaunchBrowserTask } from "./task/LaunchBrowser";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { Eclipse } from "lucide-react";
import { error } from "console";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  //setup execution environment example
  // const environment = {
  //   phases: {
  //     LaunchBrowserTask: {
  //       inputs: {
  //         websiteUrl: "google.com",
  //       },
  //       outputs: {
  //         browser: "PuppetterInstance",
  //       },
  //     },
  //   },
  // };
  const environment = { phases: {} };

  //TODO: initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);

  //TODO: initialize phase statuses
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  //finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  //TODO: clean up environment

  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

/**
 * Initializes the statuses of all phases within a given workflow execution.
 *
 * This function updates the `status` field of all execution phases associated
 * with the provided `execution` object, setting them to `PENDING`. It performs
 * a bulk update using Prisma for efficiency.
 *
 * @param {any} execution - The execution object containing an array of phases.
 * Each phase must include an `id` property.
 *
 * @returns {Promise<void>} - A promise that resolves once the update operation is complete.
 */
async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      //ignore
      //this means that we have triggered other runs for this workflow
      //while an execution was runnning
    });
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log(
    `executing phase ${phase.name} with ${creditsRequired} credits required`
  );

  await waitFor(2000);

  const success = Math.random() < 0.7;
  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}
