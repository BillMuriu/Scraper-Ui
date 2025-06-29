import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const CustomJavaScriptTask = {
  type: TaskType.CUSTOM_JAVASCRIPT,
  label: "Custom JavaScript",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-purple-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 3,
  inputs: [
    {
      name: "JavaScript Code",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
      helperText:
        "Write JavaScript code to execute. Use 'setResult(value)' to output data.",
    },
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: false,
      helperText: "Optional browser instance for page automation",
    },
    {
      name: "Input Data",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Optional input data accessible as 'inputData' variable",
    },
  ] as const,

  outputs: [
    {
      name: "Result",
      type: TaskParamType.STRING,
    },
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
