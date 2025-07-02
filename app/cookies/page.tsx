import type { Metadata } from "next"
import CookiesPageClient from "./CookiesPageClient"

export const metadata: Metadata = {
  title: "Cookies Policy | Agenta University",
  description:
    "Learn about how Agenta University uses cookies to improve your browsing experience and provide personalized services.",
}

export default function CookiesPage() {
  return <CookiesPageClient />
}
