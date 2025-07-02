"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface UniversitySearchProps {
  variant?: "light" | "dark"
  placeholder?: string
  className?: string
  buttonText?: string
  showButton?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (query: string) => void
}

export function UniversitySearch({
  variant = "light",
  placeholder = "Search universities...",
  className = "",
  buttonText = "Search",
  showButton = true,
  value,
  onChange,
  onSearch,
}: UniversitySearchProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("")
  const router = useRouter()

  // Use either controlled or uncontrolled input
  const searchTerm = value !== undefined ? value : internalSearchTerm
  const handleChange = onChange || ((e: React.ChangeEvent<HTMLInputElement>) => setInternalSearchTerm(e.target.value))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(searchTerm.trim())
      }

      router.push(`/universities?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const bgClass = variant === "light" ? "bg-white" : "bg-white/10"
  const textClass = variant === "light" ? "text-foreground" : "text-white"
  const placeholderClass = variant === "light" ? "placeholder:text-muted-foreground" : "placeholder:text-white/70"
  const borderClass = variant === "light" ? "border-input" : "border-white/20"
  const iconClass = variant === "light" ? "text-muted-foreground" : "text-white/70"
  const focusClass = variant === "light" ? "focus:border-primary" : "focus:border-white focus:bg-white/20"

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${iconClass}`} />
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-10 py-6 ${bgClass} ${textClass} ${placeholderClass} ${borderClass} ${focusClass}`}
        />
        {showButton && (
          <Button
            type="submit"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </form>
  )
}
