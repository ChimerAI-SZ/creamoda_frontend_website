export const metadata = {
  title: 'Magic Kit - CREAMODA',
  description: 'AI-powered magic kit for image editing and enhancement',
}

export default function MagicKitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="magic-kit-layout">
      {children}
    </div>
  )
}
