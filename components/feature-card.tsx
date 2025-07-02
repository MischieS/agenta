"use client"

import { FadeIn } from "@/components/ui/animated"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  delay?: number
  accentColor?: "primary" | "secondary" | "accent" | "tertiary" | "success"
}

export function FeatureCard({ title, description, icon, delay = 0, accentColor = "primary" }: FeatureCardProps) {
  // Map of color classes for different accent colors
  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    tertiary: "text-tertiary",
    success: "text-success",
  }

  // Map of border colors for different accent colors
  const borderMap = {
    primary: "border-t-primary",
    secondary: "border-t-secondary",
    accent: "border-t-accent",
    tertiary: "border-t-tertiary",
    success: "border-t-success",
  }

  return (
    <FadeIn delay={delay} direction="up">
      <motion.div
        className={`bg-card rounded-lg p-6 shadow-sm h-full border-t-4 ${borderMap[accentColor]}`}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.2 }}
      >
        <div className={`text-3xl mb-4 ${colorMap[accentColor]}`}>{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    </FadeIn>
  )
}
