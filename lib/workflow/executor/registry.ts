import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { ExtractMultipleElementsExecutor } from "./ExtractMultipleElementsExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { NavigateUrlExecutor } from "./NavigateUrlExecutor";
import { PaginationExecutor } from "./PaginationExecutor";

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  EXTRACT_MULTIPLE_ELEMENTS: ExtractMultipleElementsExecutor,
  FILL_INPUT: FillInputExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  PAGINATION: PaginationExecutor,
};
