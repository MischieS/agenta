"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent" | "success" | "urgent"
  size?: "default" | "sm" | "lg" | "xl"
  href?: string
  className?: string
  children: React.ReactNode
}

export function CustomButton({
  variant = "default",
  size = "default",
  href,
  className,
  children,
  ...props
}: CustomButtonProps) {
  // Enhanced styling for XL buttons
  const buttonClasses = cn(
    className,
    size === "xl" && "text-lg py-3 px-8 rounded-md font-medium",
    // Add a subtle shadow to primary and secondary buttons
    (variant === "default" || variant === "secondary") && "shadow-md",
    // Custom styling for our new variants
    variant === "accent" && "bg-accent text-accent-foreground hover:bg-accent/90",
    variant === "success" && "bg-success text-white hover:bg-success/90",
    variant === "urgent" && "bg-urgent text-white hover:bg-urgent/90",
  )

  // Create a properly typed motion component
  const MotionButton = motion.create(Button) as React.ComponentType<React.ComponentProps<typeof Button> & {
    whileHover?: any
    whileTap?: any
    transition?: any
  }>

  const buttonContent = (
    <MotionButton
      variant={variant === "accent" || variant === "success" || variant === "urgent" ? "default" : variant}
      size={size === "xl" ? "lg" : size}
      className={buttonClasses}
      whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionButton>
  )

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return buttonContent
}
