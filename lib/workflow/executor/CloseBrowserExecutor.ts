import { ExecutionEnvironment } from "@/types/executor";
import { CloseBrowserTask } from "../task/CloseBrowserTask";

export async function CloseBrowserExecutor(
  environment: ExecutionEnvironment<typeof CloseBrowserTask>
): Promise<boolean> {
  try {
    environment.log.info("Starting browser cleanup and closure...");

    const browser = environment.getBrowser();
    
    if (!browser) {
      environment.log.info("No browser instance found - already closed or never launched");
      environment.setOutput("Closure Status", "no_browser_found");
      return true;
    }

    // Get all pages for cleanup
    const pages = await browser.pages();
    environment.log.info(`Found ${pages.length} pages to close`);

    // Close all pages gracefully
    for (const page of pages) {
      try {
        if (!page.isClosed()) {
          await page.close();
          environment.log.info("Page closed successfully");
        }
      } catch (pageError: any) {
        environment.log.error(`Failed to close page: ${pageError.message}`);
        // Continue with other pages even if one fails
      }
    }

    // Close the browser
    await browser.close();
    environment.log.info("Browser closed successfully");

    // Clear browser reference from environment
    environment.setBrowser(null as any);
    environment.setPage(null as any);

    environment.setOutput("Closure Status", "success");
    return true;

  } catch (error: any) {
    environment.log.error(`Failed to close browser: ${error.message}`);
    environment.setOutput("Closure Status", `failed: ${error.message}`);
    
    // Even if closing fails, we should return true to not break the workflow
    // The browser process will eventually be cleaned up by the system
    return true;
  }
}
