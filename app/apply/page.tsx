
import { PageTransition } from "@/components/ui/animated"
import { SelectionWizard } from "@/components/selection-wizard"

export default function ApplyPage() {
  return (
    <PageTransition>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Apply to Study in Turkey</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Complete the application form below and our advisors will guide you through the entire process of studying at
          a Turkish university.
        </p>
        <SelectionWizard />
      </div>
    </PageTransition>
  )
}
