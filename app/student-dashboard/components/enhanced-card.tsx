"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EnhancedCardProps {
  className?: string
  gradient?: "blue" | "purple" | "green" | "amber" | "rose" | "none"
  hoverEffect?: boolean
  children: React.ReactNode
  as?: React.ElementType
  onClick?: () => void
}

const gradientStyles = {
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
  purple: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10",
  green: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10",
  amber: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
  rose: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10",
  none: "",
}

export function EnhancedCard({
  className,
  gradient = "none",
  hoverEffect = false,
  children,
  as: Component = Card,
  onClick,
  ...props
}: EnhancedCardProps & React.ComponentProps<typeof Card>) {
  return (
    <Component
      className={cn(
        "border border-border/40 shadow-lg shadow-black/5 transition-all",
        "backdrop-blur-sm",
        gradientStyles[gradient],
        hoverEffect && "hover:shadow-xl hover:-translate-y-1 hover:border-border/80",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

export const EnhancedCardHeader = React.forwardRef<
  React.ElementRef<typeof CardHeader>,
  React.ComponentPropsWithoutRef<typeof CardHeader>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("pb-3", className)} {...props} />
))
EnhancedCardHeader.displayName = "EnhancedCardHeader"

export const EnhancedCardTitle = React.forwardRef<
  React.ElementRef<typeof CardTitle>,
  React.ComponentPropsWithoutRef<typeof CardTitle>
>(({ className, ...props }, ref) => (
  <CardTitle ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
EnhancedCardTitle.displayName = "EnhancedCardTitle"

export const EnhancedCardDescription = React.forwardRef<
  React.ElementRef<typeof CardDescription>,
  React.ComponentPropsWithoutRef<typeof CardDescription>
>(({ className, ...props }, ref) => (
  <CardDescription ref={ref} className={cn("text-muted-foreground", className)} {...props} />
))
EnhancedCardDescription.displayName = "EnhancedCardDescription"

export const EnhancedCardContent = React.forwardRef<
  React.ElementRef<typeof CardContent>,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("pt-0", className)} {...props} />
))
EnhancedCardContent.displayName = "EnhancedCardContent"

export const EnhancedCardFooter = React.forwardRef<
  React.ElementRef<typeof CardFooter>,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn("flex items-center pt-0", className)} {...props} />
))
EnhancedCardFooter.displayName = "EnhancedCardFooter"
