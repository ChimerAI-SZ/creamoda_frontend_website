import Image from "next/image"

export function ImageGrid() {
  const images = [
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((src, index) => (
        <div key={index} className="aspect-[3/4] relative overflow-hidden rounded-lg">
          <Image src={src || "/placeholder.svg"} alt={`Fashion image ${index + 1}`} fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}

