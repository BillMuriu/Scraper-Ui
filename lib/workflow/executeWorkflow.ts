import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { LaunchBrowserTask } from "./task/LaunchBrowser";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";

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
    //TODO: execute phase
    //TODO: consume credits
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

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunStatus: finalStatus,
    },
  });
}
