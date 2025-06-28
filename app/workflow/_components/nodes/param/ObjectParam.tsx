"use client";

import { Label } from "@/components/ui/label";
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

interface Field {
  name: string;
  selector: string;
}

function ObjectParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const [inputFields, setInputFields] = useState<Field[]>([
    { name: "", selector: "" },
    { name: "", selector: "" },
  ]);
  const id = useId();

  useEffect(() => {
    if (Array.isArray(value)) {
      setInputFields(value);
    }
  }, [value]);

  const handleBlur = () => {
    console.log("Input Fields on blur:", inputFields);
    updateNodeParamValue(inputFields);
  };

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>

      <Dialog>
        <DialogTrigger>
          <Button variant="ghost" className="bg-secondary">
            Add more
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inputs</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DialogMultipleInput
              inputFields={inputFields}
              setInputFields={setInputFields}
              onBlur={handleBlur}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ObjectParam;
