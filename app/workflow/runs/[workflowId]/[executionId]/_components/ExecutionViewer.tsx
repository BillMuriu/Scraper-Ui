"use client";

// Worked on this at the 6th Hour
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/date";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar1Icon,
  CalendarIcon,
  CircleDashedIcon,
  Clock,
  Coins,
  Loader2,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import { useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: !!selectedPhase, // Ensures it's truthy before running
    queryFn: () =>
      selectedPhase
        ? GetWorkflowPhaseDetails(selectedPhase)
        : Promise.resolve(null),
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;
  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          {/* Status Label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CircleDashedIcon
                size={20}
                className="stroke-muted-foreground/80"
              />
              <span>Status</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
              {query.data?.status}
            </div>
          </div>

          {/* Started At Label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CalendarIcon size={20} className="stroke-muted-foreground/80" />
              <span>Started at</span>
            </div>
            <div className="font-semibold lowercase flex gap-2 items-center">
              {query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"}
            </div>
          </div>
          {/* Duaration Label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock size={20} className="stroke-muted-foreground/80" />
              <span>Duration</span>
            </div>
            <div className="font-semibold lowercase flex gap-2 items-center">
              {duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )}
            </div>
          </div>
          {/* Credits Consumed Label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <Coins size={20} className="stroke-muted-foreground/80" />
              <span>Credits Consumed</span>
            </div>
            <div className="font-semibold lowercase flex gap-2 items-center">
              {creditsConsumed}
            </div>
          </div>
          <Separator />

          <div className="flex justify-center items-center py-2 px-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
              <span className="font-semibold">Phases</span>
            </div>
          </div>

          <Separator />
          <div className="overflow-auto h-full px-2 py-4">
            {query.data?.phases.map((phase, index) => (
              <Button
                key={phase.id}
                className="w-full justify-between"
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                onClick={() => {
                  if (isRunning) return;
                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
}
