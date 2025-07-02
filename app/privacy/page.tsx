import type { Metadata } from "next"
import PrivacyPageClient from "./PrivacyPageClient"

export const metadata: Metadata = {
  title: "Privacy Policy | Agenta University",
  description: "Learn how Agenta University collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
