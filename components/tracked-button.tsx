"use client"

import { CustomButton } from "@/components/custom-button"
import { useAnalytics, type EventProperties } from "@/hooks/use-analytics"
import type React from "react"

interface TrackedButtonProps extends React.ComponentProps<typeof CustomButton> {
  trackingName: string
  trackingLocation: string
  trackingProperties?: EventProperties
  trackingType?: "button" | "cta"
}

export function TrackedButton({
  trackingName,
  trackingLocation,
  trackingProperties,
  trackingType = "button",
  onClick,
  ...props
}: TrackedButtonProps) {
  const { trackButtonClick, trackCTAClick } = useAnalytics()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click event
    if (trackingType === "cta") {
      trackCTAClick(trackingName, trackingLocation, trackingProperties)
    } else {
      trackButtonClick(trackingName, trackingLocation, trackingProperties)
    }

    // Call the original onClick handler if it exists
    if (onClick) {
      onClick(e)
    }
  }

  return <CustomButton onClick={handleClick} {...props} />
}
