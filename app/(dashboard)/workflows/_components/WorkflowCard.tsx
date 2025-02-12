"use client";

import { Card } from "@/components/ui/card";
import { Workflow } from "@prisma/client";
import React from "react";

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30"></Card>
  );
}

export default WorkflowCard;
