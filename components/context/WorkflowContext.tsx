"use client";

import { createContext, useContext, ReactNode } from "react";

interface WorkflowContextType {
  workflowId: string;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({
  workflowId,
  children,
}: {
  workflowId: string;
  children: ReactNode;
}) {
  return (
    <WorkflowContext.Provider value={{ workflowId }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
}
