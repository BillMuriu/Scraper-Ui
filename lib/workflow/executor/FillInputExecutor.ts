// The Lesson at the 7th hour is very important
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { waitFor } from "@/lib/helper/waitFor";
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input->value is not defined");
    }

    await environment.getPage()!.type(selector, value);
    await waitFor(5000);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
