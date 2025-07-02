"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/animated"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookie-consent")

    // Only show banner if no choice has been made
    if (!cookieConsent) {
      // Small delay to prevent banner from flashing on page load
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        preferences: true,
      }),
    )
    setShowBanner(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential-only")
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        preferences: false,
      }),
    )
    setShowBanner(false)
  }

  const customizePreferences = () => {
    // For now, just link to the cookies page
    // In a full implementation, this would open a modal with cookie settings
    window.location.href = "/cookies"
  }

  if (!showBanner) return null

  return (
    <FadeIn>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 pr-8">
              <h3 className="text-lg font-semibold text-primary mb-2">We value your privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                <Link href="/cookies" className="text-secondary hover:underline font-medium">
                  Cookie Policy
                </Link>{" "}
                to learn more.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" onClick={acceptEssential} className="whitespace-nowrap">
                Essential Only
              </Button>
              <Button variant="outline" size="sm" onClick={customizePreferences} className="whitespace-nowrap">
                Customize
              </Button>
              <Button size="sm" onClick={acceptAll} className="bg-secondary hover:bg-secondary-600 whitespace-nowrap">
                Accept All
              </Button>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close cookie banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
