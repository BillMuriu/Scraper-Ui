import { ExtractMultipleElementsTask } from "./ExtractMultipleElementsTask";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { FillInputTask } from "./FillInput";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  EXTRACT_MULTIPLE_ELEMENTS: ExtractMultipleElementsTask,
  FILL_INPUT: FillInputTask,
};
