"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import React, { useEffect, useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DialogMultipleInput from "./inputs/DialogMultipleInput";

function ObjectParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const [internalValue, setInternalValue] = useState<string>(
    typeof value === "string" ? value : JSON.stringify(value) // If it's an object, stringify it
  );
  const id = useId();

  useEffect(() => {
    // When value changes, parse the stringified object to maintain correct structure
    if (typeof value === "string") {
      try {
        setInternalValue(value);
      } catch (e) {
        setInternalValue("");
      }
    } else {
      setInternalValue(JSON.stringify(value));
    }
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    console.log("Input value on blur:", internalValue); // Log the value when input blurs

    try {
      // If it's valid JSON, parse it and update
      const parsedValue = JSON.parse(internalValue);
      updateNodeParamValue(parsedValue);
    } catch (e) {
      // If invalid, leave it as a string or handle error
      updateNodeParamValue(internalValue);
    }
  };

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        className="text-xs"
        id={id}
        disabled={disabled}
        value={internalValue}
        placeholder="Enter value here"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
      <Dialog>
        <DialogTrigger>
          <Button variant={"ghost"} className="bg-secondary">
            Add more
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inputs</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <div>
              <DialogMultipleInput />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ObjectParam;
