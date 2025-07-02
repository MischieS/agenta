"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  color = 'text-gray-900',
  className,
  ...props
}: StatsCardProps) {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className={cn(
            "mt-1 text-2xl font-semibold",
            color
          )}>
            {value}
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          color.replace('text-', 'bg-').replace(/\d+$/, '') + '100',
          'dark:' + color.replace('text-', 'bg-').replace(/\d+$/, '') + '900/30'
        )}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </div>
      
      {trend !== 'neutral' && trendValue && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            "inline-flex items-center text-sm font-medium",
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {trendValue}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      )}
    </div>
  )
}
