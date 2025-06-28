"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, StopCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useWorkflowExecution } from "@/components/context/WorkflowExecutionContext";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const { isExecuting, startExecution, stopExecution } = useWorkflowExecution();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (executionId) => {
      toast.success("Execution started", { id: "flow-execution" });
      if (executionId) {
        startExecution(executionId);
      }
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    },
  });

  const handleExecute = () => {
    const plan = generate();
    if (!plan) {
      return;
    }

    mutation.mutate({
      workflowId: workflowId,
      flowDefinition: JSON.stringify(toObject()),
    });
  };

  const handleStop = () => {
    stopExecution();
    toast.info("Execution stopped", { id: "flow-execution" });
  };

  if (isExecuting) {
    return (
      <Button
        variant={"outline"}
        className="flex items-center gap-2"
        onClick={handleStop}
      >
        <StopCircle size={16} className="stroke-red-600" />
        Stop
      </Button>
    );
  }

  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      onClick={handleExecute}
    >
      <PlayIcon size={16} className="stroke-orange-600" />
      Execute
    </Button>
  );
}

export default ExecuteBtn;
