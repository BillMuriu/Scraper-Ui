"use client";

import { Button } from "@/components/ui/button";
import { useWorkflowExecution } from "@/components/context/WorkflowExecutionContext";
import { NodeExecutionStatus } from "@/types/appNode";
import { InfoIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import NodeExecutionDetailsDialog from "./NodeExecutionDetailsDialog";

interface NodeExecutionDetailsButtonProps {
  nodeId: string;
}

export default function NodeExecutionDetailsButton({
  nodeId,
}: NodeExecutionDetailsButtonProps) {
  const { getNodeStatus, getPhaseIdForNode } = useWorkflowExecution();

  const nodeStatus = getNodeStatus(nodeId);
  const phaseId = getPhaseIdForNode(nodeId);

  // Only show button if node has execution data
  if (!phaseId || nodeStatus === NodeExecutionStatus.IDLE) {
    return null;
  }

  const getButtonIcon = () => {
    switch (nodeStatus) {
      case NodeExecutionStatus.SUCCESS:
        return <CheckCircle2 size={16} className="text-green-600" />;
      case NodeExecutionStatus.FAILED:
        return <XCircle size={16} className="text-red-600" />;
      case NodeExecutionStatus.RUNNING:
      case NodeExecutionStatus.PENDING:
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <InfoIcon size={16} className="text-blue-600" />;
    }
  };

  const getButtonVariant = () => {
    switch (nodeStatus) {
      case NodeExecutionStatus.SUCCESS:
        return "outline" as const;
      case NodeExecutionStatus.FAILED:
        return "destructive" as const;
      default:
        return "ghost" as const;
    }
  };

  return (
    <NodeExecutionDetailsDialog nodeId={nodeId} phaseId={phaseId}>
      <Button variant={getButtonVariant()} size="sm" className="h-6 w-6 p-0">
        {getButtonIcon()}
      </Button>
    </NodeExecutionDetailsDialog>
  );
}
