import type { Metadata } from "next"
import TermsPageClient from "./TermsPageClient"

export const metadata: Metadata = {
  title: "Terms of Service | Agenta University",
  description: "Terms and conditions for using the Agenta University platform.",
}

export default function TermsPage() {
  return <TermsPageClient />
}
