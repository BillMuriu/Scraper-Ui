// The Lesson at the 7th hour is very important

import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website url");
    // console.log("@@WEbSITE URL", websiteUrl);
    const browser = await puppeteer.launch({
      headless: false,
    });
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    // browser.pages()
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
