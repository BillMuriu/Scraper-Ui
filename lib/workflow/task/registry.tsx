import { ExtractMultipleElementsTask } from "./ExtractMultipleElementsTask";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { FillInputTask } from "./FillInput";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { CloseBrowserTask } from "./CloseBrowserTask";
import { NavigateUrlTask } from "./NavigateUrlTask";
import { PageToHtmlTask } from "./PageToHtml";
import { PaginationTask } from "./PaginationTask";
import { CSVExportTask } from "./CSVExportTask";
import { CustomJavaScriptTask } from "./CustomJavaScriptTask";

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  CLOSE_BROWSER: CloseBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  EXTRACT_MULTIPLE_ELEMENTS: ExtractMultipleElementsTask,
  FILL_INPUT: FillInputTask,
  NAVIGATE_URL: NavigateUrlTask,
  PAGINATION: PaginationTask,
  CSV_EXPORT: CSVExportTask,
  CUSTOM_JAVASCRIPT: CustomJavaScriptTask,
};
