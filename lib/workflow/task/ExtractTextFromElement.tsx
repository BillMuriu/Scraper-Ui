import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Get text from HTML",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],

  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
};
