"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "white"
  className?: string
}

export function LoadingSpinner({ size = "md", color = "primary", className = "" }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white",
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`${sizeMap[size]} ${colorMap[color]} border-4 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}
