"use client"

import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { ApplicationsDashboard } from "../components/applications-dashboard"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  
  // Redirect if not authenticated
  if (!user) {
    redirect("/signin")
  }

  return <ApplicationsDashboard />
}
