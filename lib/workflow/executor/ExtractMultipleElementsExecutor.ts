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

    let fields;
    try {
      // Ensure it's a proper JSON array
      const cleanedFieldsRaw = fieldsRaw.trim();
      const fixedJson = cleanedFieldsRaw.startsWith("[")
        ? cleanedFieldsRaw
        : `[${cleanedFieldsRaw}]`;

      // Log the corrected JSON before parsing
      console.log("Fixed Fields JSON:", fixedJson);
      environment.log.info(`Fixed Fields JSON: ${fixedJson}`);

      // Parse the corrected JSON
      fields = JSON.parse(fixedJson);
    } catch (error) {
      environment.log.error("Failed to parse Fields JSON");
      console.error("Parsing error:", error);
      return false;
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      environment.log.error("Fields is not an array or is empty");
      return false;
    }

    const $ = cheerio.load(html);
    const extractedData = fields.map(({ name, selector }) => ({
      [name]: $(selector)
        .map((_, el) => $(el).text().trim())
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
