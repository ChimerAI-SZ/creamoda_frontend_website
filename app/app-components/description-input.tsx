export function DescriptionInput() {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Describe the final design</div>
      <textarea
        className="h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground"
        placeholder="Please describe the category you would like to change."
      />
    </div>
  )
}

