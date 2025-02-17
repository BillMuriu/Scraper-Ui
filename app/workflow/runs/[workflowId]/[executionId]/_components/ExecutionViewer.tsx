"use client";

// Worked on this at the 6th Hour
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/date";
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

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

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
              <span>Started at</span>
            </div>
            <div className="font-semibold lowercase flex gap-2 items-center">
              Todo
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
                variant={"ghost"}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
