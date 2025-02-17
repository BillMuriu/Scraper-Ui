import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { Edge } from "@xyflow/react";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};
export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const executionPlan: WorkflowExecutionPlan = [];
  return { executionPlan };
}
