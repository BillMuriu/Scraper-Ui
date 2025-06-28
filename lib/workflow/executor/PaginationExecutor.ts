import { ExecutionEnvironment } from "@/types/executor";
import { PaginationTask } from "../task/PaginationTask";
import { waitFor } from "@/lib/helper/waitFor";

interface PaginationResult {
  totalPages: number;
  successfulPages: number;
  failedPages: number;
  results: Array<{
    page: number;
    url: string;
    status: "success" | "failed";
    results: string[];
    error?: string;
  }>;
}

export async function PaginationExecutor(
  environment: ExecutionEnvironment<typeof PaginationTask>
): Promise<boolean> {
  try {
    const baseUrl = environment.getInput("Base URL");
    const paginationSign = environment.getInput("Pagination Sign");
    const startPageStr = environment.getInput("Start Page");
    const endPageStr = environment.getInput("End Page");
    const elementSelector = environment.getInput("Element Selector");
    const attributeToExtract = environment.getInput("Attribute to Extract");

    // Validation
    if (
      !baseUrl ||
      !paginationSign ||
      !startPageStr ||
      !endPageStr ||
      !elementSelector ||
      !attributeToExtract
    ) {
      environment.log.error("Missing required inputs");
      return false;
    }

    const startPage = parseInt(startPageStr);
    const endPage = parseInt(endPageStr);

    if (isNaN(startPage) || isNaN(endPage)) {
      environment.log.error("Start Page and End Page must be valid numbers");
      return false;
    }

    if (startPage > endPage) {
      environment.log.error("Start Page cannot be greater than End Page");
      return false;
    }

    if (endPage - startPage > 50) {
      environment.log.error("Page range too large. Maximum 50 pages allowed");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("No browser page available");
      return false;
    }

    const paginationResult: PaginationResult = {
      totalPages: endPage - startPage + 1,
      successfulPages: 0,
      failedPages: 0,
      results: [],
    };

    environment.log.info(
      `Starting pagination scraping from page ${startPage} to ${endPage}`
    );

    // Loop through pages
    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
      const fullUrl = `${baseUrl}${paginationSign}${currentPage}`;

      try {
        environment.log.info(`Visiting page ${currentPage}: ${fullUrl}`);

        // Navigate to the page
        await page.goto(fullUrl, { waitUntil: "networkidle2", timeout: 30000 });

        // Wait a bit to ensure page is loaded
        await waitFor(500);

        // Wait for the selector to be available
        try {
          await page.waitForSelector(elementSelector, { timeout: 10000 });
        } catch (selectorError) {
          environment.log.info(
            `Selector "${elementSelector}" not found on page ${currentPage}`
          );
          paginationResult.results.push({
            page: currentPage,
            url: fullUrl,
            status: "failed",
            results: [],
            error: `Selector not found: ${elementSelector}`,
          });
          paginationResult.failedPages++;
          continue;
        }

        // Extract elements
        const extractedData = await page.evaluate(
          (selector, attribute) => {
            const elements = document.querySelectorAll(selector);
            const results: string[] = [];

            elements.forEach((element) => {
              let value = "";
              if (attribute === "textContent") {
                value = element.textContent?.trim() || "";
              } else if (attribute === "innerHTML") {
                value = element.innerHTML;
              } else {
                value = element.getAttribute(attribute) || "";
              }

              if (value) {
                results.push(value);
              }
            });

            return results;
          },
          elementSelector,
          attributeToExtract
        );

        paginationResult.results.push({
          page: currentPage,
          url: fullUrl,
          status: "success",
          results: extractedData,
          error: undefined,
        });

        paginationResult.successfulPages++;
        environment.log.info(
          `Page ${currentPage}: Extracted ${extractedData.length} elements`
        );

        // Small delay between pages to be respectful
        await waitFor(200);
      } catch (error: any) {
        environment.log.error(
          `Failed to process page ${currentPage}: ${error.message}`
        );
        paginationResult.results.push({
          page: currentPage,
          url: fullUrl,
          status: "failed",
          results: [],
          error: error.message,
        });
        paginationResult.failedPages++;
      }
    }

    // Set the output
    const jsonResult = JSON.stringify(paginationResult, null, 2);
    environment.setOutput("Scraped Data", jsonResult);

    environment.log.info(
      `Pagination complete. Success: ${paginationResult.successfulPages}, Failed: ${paginationResult.failedPages}`
    );

    return paginationResult.successfulPages > 0;
  } catch (error: any) {
    environment.log.error(`Pagination executor error: ${error.message}`);
    return false;
  }
}
