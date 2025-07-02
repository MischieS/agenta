import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AboutLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}
