import { SelectionWizard } from "@/components/selection-wizard"
import { LanguageProvider } from "@/contexts/language-context"
import { FadeIn } from "@/components/ui/animated"

export default function SelectionHelperPage() {
  return (
    <LanguageProvider>
      <main className="py-12 md:py-20">
        <FadeIn>
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Find Your Perfect University
              </h1>
              <p className="text-xl text-muted-foreground">
                Let us help you find the right program and university in Turkey. Fill out the form below to get started.
              </p>
            </div>
            <SelectionWizard />
          </div>
        </FadeIn>
      </main>
    </LanguageProvider>
  )
}
