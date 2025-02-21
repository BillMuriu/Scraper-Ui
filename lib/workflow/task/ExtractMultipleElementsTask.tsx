import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileTextIcon, LucideProps } from "lucide-react";

export const ExtractMultipleElementsTask = {
  type: TaskType.EXTRACT_MULTIPLE_ELEMENTS,
  label: "Extract multiple elements from HTML",
  icon: (props: LucideProps) => (
    <FileTextIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 3,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Fields",
      type: TaskParamType.ARRAY,
      itemType: TaskParamType.OBJECT,
      required: true,
      helperText: "Define multiple elements to extract",
      properties: {
        name: {
          type: TaskParamType.STRING,
          helperText: "Field name (e.g., 'title', 'price')",
          required: true,
        },
        selector: {
          type: TaskParamType.STRING,
          helperText: "CSS selector for the element",
          required: true,
        },
      },
    },
  ] as const,

  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
      itemType: TaskParamType.OBJECT, // Array of extracted objects
    },
  ] as const,
} satisfies WorkflowTask;
