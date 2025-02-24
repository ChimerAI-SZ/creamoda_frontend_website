"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenerateButton } from "@/components/previous-version-ui/generate-button";

interface OutfitFormProps {
  onSubmit?: (data: OutfitFormData) => void;
}

interface OutfitFormData {
  description: string;
  gender: "female" | "male";
  age: string;
  country: string;
  type: string;
}

export function OutfitForm({ onSubmit }: OutfitFormProps) {
  const [formData, setFormData] = React.useState<OutfitFormData>({
    description: "",
    gender: "female",
    age: "25",
    country: "Vatican",
    type: "mid-size",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="relative h-full flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto space-y-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Describe your outfit
            </Label>
            <Textarea
              id="description"
              placeholder="You can describe the clothing type, fit, color, print, etc."
              className="min-h-[200px] resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold">With human model</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  defaultValue="female"
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "female" | "male",
                    })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Select
                  value={formData.age}
                  onValueChange={(value) =>
                    setFormData({ ...formData, age: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Vatican", "Italy", "France", "Spain", "Germany"].map(
                      (country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["petite", "mid-size", "plus-size"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="sticky bottom-0 left-0 right-0 px-6 pb-4 bg-white">
        <GenerateButton
          onClick={handleSubmit}
          disabled={!formData.description.trim()}
        />
      </div>
    </div>
  );
}
