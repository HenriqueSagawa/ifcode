"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LanguageIcon } from "./language-icons"
import { technologies } from "@/constants/technologies"

interface TechnologySelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function TechnologySelect({ value, onValueChange }: TechnologySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="language">Tecnologia/Framework</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma tecnologia (opcional)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {technologies.map((category) => (
            <div key={category.category}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{category.category}</div>
              {category.items.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  <div className="flex items-center gap-2">
                    <LanguageIcon language={tech} />
                    <span>{tech.charAt(0).toUpperCase() + tech.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
