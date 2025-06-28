"use client";

import { NodeExecutionStatus } from "@/types/appNode";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Circle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeStatusIndicatorProps {
  status?: NodeExecutionStatus;
  className?: string;
}

export default function NodeStatusIndicator({ 
  status = NodeExecutionStatus.IDLE, 
  className 
}: NodeStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case NodeExecutionStatus.RUNNING:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case NodeExecutionStatus.SUCCESS:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case NodeExecutionStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case NodeExecutionStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case NodeExecutionStatus.IDLE:
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case NodeExecutionStatus.RUNNING:
        return "border-blue-500 bg-blue-50";
      case NodeExecutionStatus.SUCCESS:
        return "border-green-500 bg-green-50";
      case NodeExecutionStatus.FAILED:
        return "border-red-500 bg-red-50";
      case NodeExecutionStatus.PENDING:
        return "border-yellow-500 bg-yellow-50";
      case NodeExecutionStatus.IDLE:
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className={cn(
      "absolute -top-2 -right-2 rounded-full p-1 border-2 z-10",
      getStatusColor(),
      className
    )}>
      {getStatusIcon()}
    </div>
  );
}
