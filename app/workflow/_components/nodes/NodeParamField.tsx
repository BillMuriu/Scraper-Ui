"use client";

import { TaskParam } from "@/types/task";
import React from "react";

function NodeParamField({ param }: { param: TaskParam }) {
  return <div>{param.name}</div>;
}

export default NodeParamField;
