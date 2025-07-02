"use client"

import { useLanguage } from "@/contexts/language-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
