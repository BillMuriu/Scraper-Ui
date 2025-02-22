"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

interface Field {
  name: string;
  selector: string;
}

function DialogMultipleInput() {
  const [inputFields, setInputFields] = useState<Field[]>([
    { name: "", selector: "" },
  ]);

  const handleChangeInput = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(index, event.target.name);
  };

  return (
    <div>
      {inputFields.map((inputField, index) => (
        <div key={index} className="flex gap-2">
          <Input
            name="name"
            placeholder="name"
            value={inputField.name}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <Input
            name="selector"
            placeholder="selector"
            value={inputField.selector}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <Button className="rounded-full" variant="ghost" size="sm">
            <MinusIcon />
          </Button>
          <Button className="rounded-full" variant="ghost" size="sm">
            <PlusIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default DialogMultipleInput;
