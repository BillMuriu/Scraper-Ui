// The Lesson at the 7th hour is very important
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Web Page");
    console.log("@@WEbSITE URL", websiteUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
