// The Lesson at the 7th hour is very important
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website url");
    console.log("@@WEbSITE URL", websiteUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
