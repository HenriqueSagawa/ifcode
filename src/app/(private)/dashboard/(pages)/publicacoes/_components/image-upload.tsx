"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import type React from "react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      onImagesChange([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="images">Imagens</Label>
        <div className="flex items-center space-x-2">
          <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          <Button type="button" variant="outline" onClick={() => document.getElementById("images")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Imagens
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
