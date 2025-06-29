"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetNodeExecutionDetails } from "@/actions/workflows/getNodeExecutionDetails";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Loader2 } from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";

interface NodeExecutionDetailsDialogProps {
  nodeId: string;
  phaseId: string;
  children: ReactNode;
}

export default function NodeExecutionDetailsDialog({
  nodeId,
  phaseId,
  children,
}: NodeExecutionDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    data: executionDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["nodeExecutionDetails", phaseId],
    queryFn: () => GetNodeExecutionDetails(phaseId),
    enabled: open && !!phaseId,
  });

  const formatDuration = (duration: number | null) => {
    if (!duration) return "Unknown";
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string | Date | null) => {
    if (!timestamp) return "Not available";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "RUNNING":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Execution Details
            {executionDetails && (
              <Badge className={getStatusColor(executionDetails.status)}>
                {executionDetails.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {executionDetails?.name || "Loading execution details..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading execution details...</span>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center py-8">
            Error loading execution details: {error.message}
          </div>
        )}

        {executionDetails && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Started:</strong>{" "}
                {formatTimestamp(executionDetails.startedAt)}
              </div>
              <div>
                <strong>Completed:</strong>{" "}
                {formatTimestamp(executionDetails.completedAt)}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {formatDuration(executionDetails.duration)}
              </div>
              <div>
                <strong>Node ID:</strong> {executionDetails.nodeId}
              </div>
            </div>

            <Tabs defaultValue="inputs" className="w-full flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                <TabsTrigger value="outputs">Outputs</TabsTrigger>
                <TabsTrigger value="logs">
                  Logs ({executionDetails.logs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inputs" className="space-y-4 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="pr-4">
                    {Object.keys(executionDetails.inputs).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(executionDetails.inputs).map(([key, value]) => (
                          <ContentRenderer
                            key={key}
                            name={key}
                            content={value}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">
                        No inputs available
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="outputs" className="space-y-4 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="pr-4">
                    {Object.keys(executionDetails.outputs).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(executionDetails.outputs).map(([key, value]) => (
                          <ContentRenderer
                            key={key}
                            name={key}
                            content={value}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">
                        No outputs available
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4 flex-1 overflow-hidden">
                <ScrollArea className="h-full rounded border p-4">
                  {executionDetails.logs.length > 0 ? (
                    <div className="space-y-2">
                      {executionDetails.logs.map((log) => (
                        <div
                          key={log.id}
                          className="border-b pb-2 last:border-b-0"
                        >
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className={getLogLevelColor(log.level)}>
                              [{log.level.toUpperCase()}]
                            </span>
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                          <div className="text-sm mt-1 break-words">{log.message}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No logs available</p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}

        <DialogFooter className="sm:justify-start flex-shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
