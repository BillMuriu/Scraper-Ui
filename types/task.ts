export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  CLOSE_BROWSER = "CLOSE_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  EXTRACT_MULTIPLE_ELEMENTS = "EXTRACT_MULTIPLE_ELEMENTS",
  FILL_INPUT = "FILL_INPUT",
  NAVIGATE_URL = "NAVIGATE_URL",
  PAGINATION = "PAGINATION",
  CSV_EXPORT = "CSV_EXPORT",
  CUSTOM_JAVASCRIPT = "CUSTOM_JAVASCRIPT",
}

export enum TaskParamType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT",
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  value?: string;
  [key: string]: any;
}
