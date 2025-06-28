import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { PowerOffIcon, LucideProps } from "lucide-react";

export const CloseBrowserTask = {
  type: TaskType.CLOSE_BROWSER,
  label: "Close Browser",
  icon: (props: LucideProps) => (
    <PowerOffIcon className="stroke-red-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      helperText: "Browser instance to close",
    },
  ] as const,
  outputs: [
    {
      name: "Closure Status",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
