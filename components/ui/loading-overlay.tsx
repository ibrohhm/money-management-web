import { Spinner } from "@/components/ui/spinner"

interface LoadingOverlayProps {
  isLoading: boolean
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/1 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner className="h-12 w-12 text-primary" />
    </div>
  )
}
