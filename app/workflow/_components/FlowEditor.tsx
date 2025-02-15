"use client";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect } from "react";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const fitViewOptions = { padding: 2 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const newNode = CreateFlowNode(taskType as TaskType);
    setNodes((nds) => nds.concat(newNode));
  }, []);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        // onEdgesChange={onEdgesChange} - Save Mutation
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitViewOptions={fitViewOptions}
        minZoom={0.01}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Controls
          position="top-left"
          fitViewOptions={fitViewOptions}
          className="bg-primary text-primary color-green rounded-lg shadow-lg"
        />

        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
