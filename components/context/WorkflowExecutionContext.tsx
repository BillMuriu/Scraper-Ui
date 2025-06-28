"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  ReactNode, 
  useEffect 
} from "react";
import { NodeExecutionStatus } from "@/types/appNode";
import { useQuery } from "@tanstack/react-query";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { WorkflowExecutionStatus } from "@/types/workflow";

interface WorkflowExecutionContextType {
  isExecuting: boolean;
  executionId: string | null;
  nodeStatuses: Record<string, NodeExecutionStatus>;
  startExecution: (executionId: string) => void;
  stopExecution: () => void;
  getNodeStatus: (nodeId: string) => NodeExecutionStatus;
}

const WorkflowExecutionContext = createContext<WorkflowExecutionContextType | null>(null);

export function WorkflowExecutionProvider({ children }: { children: ReactNode }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeExecutionStatus>>({});

  // Query for execution status with polling
  const { data: executionData } = useQuery({
    queryKey: ["workflowExecution", executionId],
    queryFn: () => executionId ? GetWorkflowExecutionWithPhases(executionId) : null,
    enabled: !!executionId && isExecuting,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === WorkflowExecutionStatus.RUNNING ? 1000 : false;
    },
  });

  // Update node statuses based on execution data
  useEffect(() => {
    if (!executionData?.phases) return;

    const newNodeStatuses: Record<string, NodeExecutionStatus> = {};
    
    executionData.phases.forEach((phase) => {
      try {
        // Parse the node JSON to get the node ID
        const nodeData = JSON.parse(phase.node);
        const nodeId = nodeData.id;
        
        if (!nodeId) return;
        
        switch (phase.status) {
          case "CREATED":
          case "PENDING":
            newNodeStatuses[nodeId] = NodeExecutionStatus.PENDING;
            break;
          case "RUNNING":
            newNodeStatuses[nodeId] = NodeExecutionStatus.RUNNING;
            break;
          case "COMPLETED":
            newNodeStatuses[nodeId] = NodeExecutionStatus.SUCCESS;
            break;
          case "FAILED":
            newNodeStatuses[nodeId] = NodeExecutionStatus.FAILED;
            break;
          default:
            newNodeStatuses[nodeId] = NodeExecutionStatus.IDLE;
        }
      } catch (error) {
        console.error("Failed to parse phase node data:", error);
      }
    });

    setNodeStatuses(newNodeStatuses);

    // Stop execution if workflow is complete
    if (executionData.status !== WorkflowExecutionStatus.RUNNING) {
      setIsExecuting(false);
    }
  }, [executionData]);

  const startExecution = useCallback((newExecutionId: string) => {
    setExecutionId(newExecutionId);
    setIsExecuting(true);
    setNodeStatuses({}); // Reset node statuses
  }, []);

  const stopExecution = useCallback(() => {
    setIsExecuting(false);
    setExecutionId(null);
    setNodeStatuses({});
  }, []);

  const getNodeStatus = useCallback((nodeId: string): NodeExecutionStatus => {
    return nodeStatuses[nodeId] || NodeExecutionStatus.IDLE;
  }, [nodeStatuses]);

  return (
    <WorkflowExecutionContext.Provider value={{
      isExecuting,
      executionId,
      nodeStatuses,
      startExecution,
      stopExecution,
      getNodeStatus,
    }}>
      {children}
    </WorkflowExecutionContext.Provider>
  );
}

export function useWorkflowExecution() {
  const context = useContext(WorkflowExecutionContext);
  if (!context) {
    throw new Error("useWorkflowExecution must be used within WorkflowExecutionProvider");
  }
  return context;
}
