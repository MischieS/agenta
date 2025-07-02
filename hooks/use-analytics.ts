"use client"

import { useCallback } from "react"

// Define event categories
export type EventCategory = "engagement" | "navigation" | "conversion" | "search" | "form"

// Define event properties
export interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

// Analytics service interface
interface AnalyticsService {
  trackEvent: (category: EventCategory, action: string, label?: string, properties?: EventProperties) => void
  trackPageView: (path: string, title?: string) => void
}

// Mock analytics service (replace with your actual analytics service)
const analyticsService: AnalyticsService = {
  trackEvent: (category, action, label, properties) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] Event: ${category} - ${action} - ${label || ""}`, properties || {})
    }

    // In a real implementation, you would send this data to your analytics service
    // Example: window.gtag('event', action, { event_category: category, event_label: label, ...properties })
  },

  trackPageView: (path, title) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] Page View: ${path} - ${title || ""}`)
    }

    // In a real implementation, you would send this data to your analytics service
    // Example: window.gtag('config', 'GA-ID', { page_path: path, page_title: title })
  },
}

export function useAnalytics() {
  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, location: string, properties?: EventProperties) => {
    analyticsService.trackEvent("engagement", "button_click", buttonName, {
      location,
      ...properties,
    })
  }, [])

  // Track CTA clicks specifically
  const trackCTAClick = useCallback((ctaName: string, location: string, properties?: EventProperties) => {
    analyticsService.trackEvent("conversion", "cta_click", ctaName, {
      location,
      ...properties,
    })
  }, [])

  // Track form submissions
  const trackFormSubmission = useCallback((formName: string, properties?: EventProperties) => {
    analyticsService.trackEvent("form", "submit", formName, properties)
  }, [])

  // Track search queries
  const trackSearch = useCallback((query: string, resultsCount?: number) => {
    analyticsService.trackEvent("search", "query", query, {
      resultsCount,
    })
  }, [])

  // Track page views
  const trackPageView = useCallback((path: string, title?: string) => {
    analyticsService.trackPageView(path, title)
  }, [])

  return {
    trackButtonClick,
    trackCTAClick,
    trackFormSubmission,
    trackSearch,
    trackPageView,
  }
}
