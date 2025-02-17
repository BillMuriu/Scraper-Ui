// @ 4 hours and 50 minutes

import { AppNodeMissingInputs } from "@/types/appNode"; // Import the type for missing input errors
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

/**
 * Defines the shape of the FlowValidationContext.
 * This context is responsible for managing validation errors related to missing inputs in a workflow.
 */
type FlowValidationContextType = {
  /**
   * Array of missing inputs.
   * Each item represents a node with missing required data.
   */
  invalidInputs: AppNodeMissingInputs[];

  /**
   * Function to update the list of missing inputs.
   * Accepts a new array of missing inputs or a function that modifies the current array.
   */
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;

  /**
   * Function to clear all validation errors by resetting `invalidInputs` to an empty array.
   */
  clearErrors: () => void;
};

/**
 * Creates the FlowValidationContext.
 * This context will store the validation errors and provide functions to manage them.
 * Initially, it is set to `null` to ensure it is only used within a Provider.
 */
export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

/**
 * FlowValidationContextProvider component.
 * This component acts as a wrapper to provide validation state to its children.
 *
 * @param {ReactNode} children - The components that will have access to this context.
 */
export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  /**
   * `invalidInputs` holds an array of missing input errors.
   * `setInvalidInputs` is a function to update `invalidInputs`.
   * Initially, `invalidInputs` is an empty array since no errors exist at the start.
   */
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  /**
   * Clears all validation errors by resetting `invalidInputs` to an empty array.
   * This function is useful when a user fixes errors and we need to reset the validation state.
   */
  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    /**
     * FlowValidationContext.Provider wraps the children components.
     * It provides:
     * - `invalidInputs`: The current array of missing input errors.
     * - `setInvalidInputs`: Function to update the list of errors.
     * - `clearErrors`: Function to reset errors.
     *
     * Any component inside this Provider can access and update the validation state.
     */
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
