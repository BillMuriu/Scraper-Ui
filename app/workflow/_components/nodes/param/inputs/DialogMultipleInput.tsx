"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

interface Field {
  name: string;
  selector: string;
}

interface Props {
  inputFields: Field[];
  setInputFields: React.Dispatch<React.SetStateAction<Field[]>>;
  onBlur: () => void;
}

function DialogMultipleInput({ inputFields, setInputFields, onBlur }: Props) {
  const handleChangeInput = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setInputFields((prev) => {
      const newFields = [...prev];
      newFields[index][name as keyof Field] = value;
      return newFields;
    });
  };

  const handleAddField = () => {
    setInputFields((prev) => [...prev, { name: "", selector: "" }]);
  };

  const handleRemoveField = (index: number) => {
    setInputFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      {inputFields.map((inputField, index) => (
        <div key={index} className="flex gap-2">
          <Input
            name="name"
            placeholder="name"
            value={inputField.name}
            onChange={(event) => handleChangeInput(index, event)}
            onBlur={onBlur}
          />
          <Input
            name="selector"
            placeholder="selector"
            value={inputField.selector}
            onChange={(event) => handleChangeInput(index, event)}
            onBlur={onBlur}
          />
          <Button
            className="rounded-full"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveField(index)}
          >
            <MinusIcon />
          </Button>
          <Button
            className="rounded-full"
            variant="ghost"
            size="sm"
            onClick={handleAddField}
          >
            <PlusIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default DialogMultipleInput;
