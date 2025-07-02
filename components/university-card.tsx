"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, GraduationCap, BookOpen, Award, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface UniversityCardProps {
  id: number
  name: string
  location: string
  image: string
  programs: number
  faculties: number
  type: string
  ranking: number
  languages: string[]
  delay?: number
}

export function UniversityCard({
  id,
  name,
  location,
  image,
  programs,
  faculties,
  type,
  ranking,
  languages,
  delay = 0,
}: UniversityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate a slug from the university name
  const slug = name
    .toLowerCase()
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-primary font-medium">
              Rank #{ranking}
            </Badge>
          </div>
        </div>
        <CardContent className="flex-grow pt-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{name}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-primary" />
              <span>
                {type} • {faculties} Faculties
              </span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              <span>{programs} Programs</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              <span>{languages.join(", ")}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <Link href={`/universities/${slug}`} className="w-full">
            <Button variant="outline" className="w-full group">
              <span className="mr-2">View Details</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
