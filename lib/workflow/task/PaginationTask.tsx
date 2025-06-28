import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, MoreHorizontalIcon } from "lucide-react";

export const PaginationTask = {
  type: TaskType.PAGINATION,
  label: "Pagination Scraper",
  icon: (props: LucideProps) => (
    <MoreHorizontalIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 5,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Base URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "The base URL for pagination (e.g., https://example.com/posts)",
    },
    {
      name: "Pagination Sign",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Pagination parameter (e.g., ?page=, &p=, #page=)",
      value: "?page=",
    },
    {
      name: "Start Page",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Starting page number",
      value: "1",
    },
    {
      name: "End Page",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Ending page number",
      value: "5",
    },
    {
      name: "Element Selector",
      type: TaskParamType.STRING,
      required: true,
      helperText: "CSS selector for elements to extract from each page",
    },
    {
      name: "Attribute to Extract",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Attribute to extract (e.g., href, textContent, src)",
      value: "href",
    },
  ] as const,

  outputs: [
    {
      name: "Scraped Data",
      type: TaskParamType.STRING,
    },
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
