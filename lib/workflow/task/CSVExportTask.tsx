import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Download, LucideProps } from "lucide-react";

export const CSVExportTask = {
  type: TaskType.CSV_EXPORT,
  label: "Export to CSV",
  icon: (props: LucideProps) => (
    <Download className="stroke-green-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Data Source",
      type: TaskParamType.STRING,
      required: true,
      helperText: "JSON data from previous node to export as CSV",
    },
    {
      name: "File Name",
      type: TaskParamType.STRING,
      required: false,
      helperText:
        "Custom filename (optional). Default: scraped-data-timestamp.csv",
      value: "",
    },
  ] as const,

  outputs: [
    {
      name: "Download URL",
      type: TaskParamType.STRING,
    },
    {
      name: "Row Count",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
