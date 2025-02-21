// The Lesson at the 7th hour is very important
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    // console.log("@PAGE HTML", html);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
