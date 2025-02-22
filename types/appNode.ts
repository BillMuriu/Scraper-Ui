import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, any>; // Use 'any' instead of 'string' for flexibility
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
