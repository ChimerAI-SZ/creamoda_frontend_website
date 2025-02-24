"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const types = [
  { value: "style", label: "Style Change" },
  { value: "color", label: "Color Change" },
  { value: "pattern", label: "Pattern Change" },
  { value: "material", label: "Material Change" },
]

export function TypeSelector() {
  const [selectedType, setSelectedType] = useState(types[0].value)

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }

  const renderContent = () => {
    switch (selectedType) {
      case "style":
        return <p>Content for Style Change</p>
      case "color":
        return <p>Content for Color Change</p>
      case "pattern":
        return <p>Content for Pattern Change</p>
      case "material":
        return <p>Content for Material Change</p>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-4">{renderContent()}</div>
    </div>
  )
}

