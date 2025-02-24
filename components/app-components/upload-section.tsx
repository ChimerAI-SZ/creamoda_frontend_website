import { Upload, Wand2 } from "lucide-react"

export function UploadSection() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="text-sm font-medium">Text to image</span>
        </div>
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-[#eb6f0a]" />
          <span className="text-sm font-medium text-[#eb6f0a]">Image to image</span>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-[#eb6f0a]/10 p-2">
            <Upload className="h-6 w-6 text-[#eb6f0a]" />
          </div>
          <div className="text-sm font-medium">Upload your original image</div>
          <div className="text-xs text-muted-foreground">Format: jpeg, .png</div>
        </div>
      </div>
    </>
  )
}

