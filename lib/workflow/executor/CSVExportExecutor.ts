import { ExecutionEnvironment } from "@/types/executor";
import { CSVExportTask } from "../task/CSVExportTask";
import * as fs from "fs/promises";
import * as path from "path";

export async function CSVExportExecutor(
  environment: ExecutionEnvironment<typeof CSVExportTask>
): Promise<boolean> {
  try {
    const dataSource = environment.getInput("Data Source");
    const customFileName = environment.getInput("File Name");

    if (!dataSource) {
      environment.log.error("Data Source is required");
      return false;
    }

    // Parse the JSON data
    let parsedData: any;
    try {
      parsedData = JSON.parse(dataSource);
    } catch (parseError) {
      environment.log.error(`Failed to parse JSON data: ${parseError}`);
      return false;
    }

    environment.log.info("Starting CSV export...");

    // Transform data to CSV-ready format
    const csvData = transformToCSVData(parsedData);

    if (csvData.length === 0) {
      environment.log.error("No data to export");
      return false;
    }

    // Generate CSV content
    const csvContent = generateCSV(csvData);

    // Generate filename
    const fileName = generateFileName(customFileName);

    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), "public", "exports");
    try {
      await fs.mkdir(exportsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
    }

    // Save file
    const filePath = path.join(exportsDir, fileName);
    await fs.writeFile(filePath, csvContent, "utf8");

    // Generate download URL
    const downloadUrl = `/exports/${fileName}`;

    // Set outputs
    environment.setOutput("Download URL", downloadUrl);
    environment.setOutput("Row Count", csvData.length.toString());

    environment.log.info(
      `CSV exported successfully: ${fileName} (${csvData.length} rows)`
    );

    return true;
  } catch (error: any) {
    environment.log.error(`CSV export failed: ${error.message}`);
    return false;
  }
}

function transformToCSVData(data: any): Array<Record<string, any>> {
  // Case 1: Already an array of objects
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    return data.map((item) => flattenObject(item));
  }

  // Case 2: Pagination results structure
  if (data.results && Array.isArray(data.results)) {
    return flattenPaginationResults(data);
  }

  // Case 3: Single object - convert to single row
  if (typeof data === "object" && !Array.isArray(data)) {
    return [flattenObject(data)];
  }

  // Case 4: Array of primitives
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      index: index + 1,
      value: String(item),
    }));
  }

  // Case 5: Single primitive value
  return [{ value: String(data) }];
}

function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = "";
      } else if (Array.isArray(value)) {
        // Convert arrays to comma-separated strings
        flattened[newKey] = value.join(", ");
      } else if (typeof value === "object") {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, newKey));
      } else {
        flattened[newKey] = String(value);
      }
    }
  }

  return flattened;
}

function flattenPaginationResults(
  paginationData: any
): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = [];

  // Add summary row first
  rows.push({
    type: "summary",
    totalPages: paginationData.totalPages || "",
    successfulPages: paginationData.successfulPages || "",
    failedPages: paginationData.failedPages || "",
    timestamp: new Date().toISOString(),
    page: "",
    pageUrl: "",
    pageStatus: "",
    itemIndex: "",
    itemValue: "",
    error: "",
  });

  // Add data rows
  if (paginationData.results && Array.isArray(paginationData.results)) {
    paginationData.results.forEach((pageResult: any) => {
      if (pageResult.results && Array.isArray(pageResult.results)) {
        pageResult.results.forEach((item: any, index: number) => {
          rows.push({
            type: "data",
            totalPages: "",
            successfulPages: "",
            failedPages: "",
            timestamp: "",
            page: pageResult.page || "",
            pageUrl: pageResult.url || "",
            pageStatus: pageResult.status || "",
            itemIndex: index + 1,
            itemValue: String(item),
            error: pageResult.error || "",
          });
        });
      } else if (pageResult.status === "failed") {
        // Add failed page row
        rows.push({
          type: "error",
          totalPages: "",
          successfulPages: "",
          failedPages: "",
          timestamp: "",
          page: pageResult.page || "",
          pageUrl: pageResult.url || "",
          pageStatus: pageResult.status || "",
          itemIndex: "",
          itemValue: "",
          error: pageResult.error || "Unknown error",
        });
      }
    });
  }

  return rows;
}

function generateCSV(data: Array<Record<string, any>>): string {
  if (data.length === 0) return "";

  // Get all unique column names
  const columns = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => columns.add(key));
  });

  const columnArray = Array.from(columns).sort();

  // Create header row
  const csvRows = [columnArray.join(",")];

  // Create data rows
  data.forEach((row) => {
    const csvRow = columnArray.map((column) => {
      const value = row[column] || "";
      const stringValue = String(value);

      // Escape commas, quotes, and newlines
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(csvRow.join(","));
  });

  return csvRows.join("\n");
}

function generateFileName(customName?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19); // YYYY-MM-DDTHH-MM-SS

  const baseName =
    customName && customName.trim()
      ? customName.trim().replace(/[^a-zA-Z0-9-_]/g, "_")
      : "scraped-data";

  return `${baseName}-${timestamp}.csv`;
}
