import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function TermsLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
