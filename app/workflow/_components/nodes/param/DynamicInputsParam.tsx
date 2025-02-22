import { useCallback, useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ParamProps } from "@/types/appNode";

export default function DynamicInputs({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const id = useId();
  const [internalValues, setInternalValues] = useState<
    { name: string; selector: string }[] // Ensure internalValues is an array of objects
  >(Array.isArray(value) ? value : []); // Set the initial value based on the passed `value`

  useEffect(() => {
    setInternalValues(Array.isArray(value) ? value : []);
  }, [value]);

  const updateValues = (newValues: { name: string; selector: string }[]) => {
    setInternalValues(newValues);
    updateNodeParamValue(newValues);
  };

  const handleAdd = () =>
    updateValues([...internalValues, { name: "", selector: "" }]);

  const handleRemove = (index: number) => {
    updateValues(internalValues.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "name" | "selector",
    newValue: string
  ) => {
    const updated = [...internalValues];
    updated[index] = { ...updated[index], [field]: newValue };
    updateValues(updated);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </label>
      {internalValues.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="text"
            value={item.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            placeholder="Field name (e.g., 'title')"
            disabled={disabled}
          />
          <Input
            type="text"
            value={item.selector}
            onChange={(e) => handleChange(index, "selector", e.target.value)}
            placeholder="CSS selector (e.g., '.price')"
            disabled={disabled}
          />
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleRemove(index)}
            disabled={disabled}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={handleAdd} disabled={disabled}>
        + Add Field
      </Button>
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}
