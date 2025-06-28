import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export enum NodeExecutionStatus {
  IDLE = "IDLE",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, any>; // Use 'any' instead of 'string' for flexibility
  executionStatus?: NodeExecutionStatus;
  executionError?: string;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: any) => void;
  disabled?: boolean;
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
