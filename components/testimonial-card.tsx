"use client"

import { FadeIn } from "@/components/ui/animated"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  name: string
  country: string
  university: string
  delay?: number
}

export function TestimonialCard({ quote, name, country, university, delay = 0 }: TestimonialCardProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <motion.div
        className="bg-card rounded-lg p-6 shadow-sm border h-full"
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="text-3xl mb-4 text-secondary"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2, originX: 0 }}
          transition={{ duration: 0.3 }}
        >
          "
        </motion.div>
        <p className="italic mb-6">{quote}</p>
        <div className="border-t pt-4 border-secondary/20">
          <p className="font-medium text-primary">{name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-secondary">{country}</span> • {university}
          </p>
        </div>
      </motion.div>
    </FadeIn>
  )
}
