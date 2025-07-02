"use client"

import Image from "next/image"
import { TrackedButton } from "@/components/tracked-button"
import { StaggerContainer, StaggerItem } from "@/components/ui/animated"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  trackingName: string
}

export function HeroSection({ title, subtitle, ctaText, ctaLink, trackingName }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center py-20 md:py-28 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <Image 
              src="/turkish-university-campus.jpg" 
              alt="Turkish university campus" 
              width={1920} 
              height={1080}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="space-y-6 text-white text-center mb-8">
            <StaggerItem>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{title}</h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-white/90 text-lg md:text-xl max-w-[800px] mx-auto">{subtitle}</p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <TrackedButton
                  size="xl"
                  variant="accent"
                  href={ctaLink}
                  trackingName={trackingName}
                  trackingLocation="hero"
                  trackingType="cta"
                >
                  {ctaText}
                </TrackedButton>
                <TrackedButton
                  size="xl"
                  variant="outline"
                  href="/wizard"
                  trackingName="university_wizard"
                  trackingLocation="hero"
                  trackingType="cta"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  Find Your University
                </TrackedButton>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
