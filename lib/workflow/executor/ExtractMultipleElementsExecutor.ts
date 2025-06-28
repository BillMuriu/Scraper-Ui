import { ExecutionEnvironment } from "@/types/executor";
import { ExtractMultipleElementsTask } from "../task/ExtractMultipleElementsTask";
import * as cheerio from "cheerio";

export async function ExtractMultipleElementsExecutor(
  environment: ExecutionEnvironment<typeof ExtractMultipleElementsTask>
): Promise<boolean> {
  try {
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not defined");
      return false;
    }

    const fieldsRaw = environment.getInput("Fields");
    if (!fieldsRaw) {
      environment.log.error("Fields not defined");
      return false;
    }

    // Log the raw input for debugging
    console.log("Raw Fields Input:", fieldsRaw);
    environment.log.info(`Raw Fields Input: ${fieldsRaw}`);

    // No need for JSON parsing or trimming
    const fields = fieldsRaw; // fieldsRaw is already an array

    if (!Array.isArray(fields) || fields.length === 0) {
      environment.log.error("Fields is not an array or is empty");
      return false;
    }

    const $ = cheerio.load(html);
    const extractedData = fields.map(({ name, selector }) => ({
      [name]: $(selector)
        .map((_, el) => $(el).text().trim()) // Trim text content if needed
        .get(),
    }));

    environment.setOutput("Extracted Data", JSON.stringify(extractedData));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    console.error("Executor error:", error);
    return false;
  }
}
