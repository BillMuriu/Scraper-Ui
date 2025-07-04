"use client";

import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { WorkflowExecutionProvider } from "@/components/context/WorkflowExecutionContext";

function Editor({ workflow }: { workflow: Workflow }) {
  //   return <div>Editor</div>;
  return (
    <FlowValidationContextProvider>
      <WorkflowExecutionProvider>
        <ReactFlowProvider>
          <div className="flex flex-col h-full w-full overflow-hidden">
            <Topbar title="Workflow Page" subtitle="" workflowId={workflow.id} hideButtons={false} />
            <section className="flex h-full overflow-auto">
              <TaskMenu />
              <FlowEditor workflow={workflow} />
            </section>
          </div>
        </ReactFlowProvider>
      </WorkflowExecutionProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
