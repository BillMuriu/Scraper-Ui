import { ExecutionEnvironment } from "@/types/executor";
import { CustomJavaScriptTask } from "../task/CustomJavaScriptTask";
import * as vm from "vm";

export async function CustomJavaScriptExecutor(
  environment: ExecutionEnvironment<typeof CustomJavaScriptTask>
): Promise<boolean> {
  try {
    const jsCode = environment.getInput("JavaScript Code");
    if (!jsCode) {
      environment.log.error("JavaScript Code not provided");
      return false;
    }

    environment.log.info("Starting JavaScript code execution");

    // Create a safe execution context
    const executionContext = createSafeContext(environment);

    // Execute the user's JavaScript code
    const result = await executeUserCode(jsCode, executionContext);

    environment.log.info("JavaScript code executed successfully");

    // If user didn't call setResult but returned a value, use that
    if (result !== undefined && !executionContext._resultSet) {
      environment.setOutput("Result", JSON.stringify(result));
    }

    return true;
  } catch (error: any) {
    environment.log.error(`JavaScript execution failed: ${error.message}`);
    return false;
  }
}

function createSafeContext(
  environment: ExecutionEnvironment<typeof CustomJavaScriptTask>
) {
  let resultSet = false;

  const context = {
    // Input data
    inputData: environment.getInput("Input Data"),

    // Browser access (if available)
    page: environment.getPage(),
    browser: environment.getBrowser(),

    // Logging functions
    log: {
      info: (message: string) => environment.log.info(`[User Code] ${message}`),
      error: (message: string) =>
        environment.log.error(`[User Code] ${message}`),
    },

    // Utility functions
    wait: (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, Math.min(ms, 30000))),

    // Output function
    setResult: (value: any) => {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      environment.setOutput("Result", stringValue);
      resultSet = true;
    },

    // Safe globals
    JSON,
    Date,
    Math,
    Promise,
    setTimeout: (fn: Function, ms: number) =>
      setTimeout(fn, Math.min(ms, 30000)),

    // Console for debugging
    console: {
      log: (message: any) =>
        environment.log.info(`[Console] ${JSON.stringify(message)}`),
      error: (message: any) =>
        environment.log.error(`[Console] ${JSON.stringify(message)}`),
    },

    // Internal flag to track if result was set
    _resultSet: resultSet,
  };

  // Update the _resultSet getter to return current state
  Object.defineProperty(context, "_resultSet", {
    get: () => resultSet,
    enumerable: false,
  });

  return context;
}

async function executeUserCode(code: string, context: any): Promise<any> {
  // Create VM context
  const vmContext = vm.createContext(context);

  // Wrap user code in an async function
  const wrappedCode = `
    (async function userScript() {
      try {
        ${code}
      } catch (error) {
        log.error('Error in user code: ' + error.message);
        throw error;
      }
    })()
  `;

  try {
    // Compile and run the script with timeout
    const script = new vm.Script(wrappedCode);
    const result = await script.runInContext(vmContext, {
      timeout: 30000, // 30 second timeout
      displayErrors: true,
    });

    return result;
  } catch (error: any) {
    if (error.message.includes("Script execution timed out")) {
      throw new Error("Code execution timed out after 30 seconds");
    }
    throw error;
  }
}
