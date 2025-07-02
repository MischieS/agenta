"use client"

import { TrackedButton } from "@/components/tracked-button"
import { FeatureCard } from "@/components/feature-card"
import { FadeIn, ScaleIn, PageTransition } from "@/components/ui/animated"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import dynamic from "next/dynamic"

// Dynamically import heavy components
const TestimonialCard = dynamic(() => import("@/components/testimonial-card").then(mod => mod.TestimonialCard), { ssr: true })
const HeroSection = dynamic(() => import("@/components/hero-section").then(mod => mod.HeroSection), { ssr: true })
const EverythingHandledSection = dynamic(() => import("@/components/EverythingHandledSection"), { ssr: true })
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false })

// Dynamically import animated components with loading fallbacks
const AnimatedIllustrations = dynamic(
  () => import("@/components/animated-illustrations").then(mod => ({ 
    default: () => (
      <>
        <mod.ContactHeroIllustration />
        <mod.WaveAnimation />
      </>
    )
  })),
  { ssr: false, loading: () => <div className="skeleton-animation h-full w-full" /> }
)

export default function Home() {
  const { t } = useLanguage()
  const { trackPageView } = useAnalytics()

  // Track page view when component mounts
  useEffect(() => {
    trackPageView("/", "Home Page")
  }, [trackPageView])

  return (
    <PageTransition>

      <div className="flex min-h-screen flex-col">
        <main className="flex-1" aria-label="Main content">
          {/* Hero Section */}
          <header>
            <HeroSection
              title="Your Gateway to Turkish Education"
              subtitle="Let us handle every detail of your study journey in Turkey. Scholarships, housing, paperwork, and more – we make it easy."
              ctaText="Apply Now – Start Your Journey"
              ctaLink="/apply"
              trackingName="apply_now"
            />
          </header>

          {/* Features Section - Updated with 6 cards */}
          <section className="bg-muted py-16" aria-labelledby="features-heading">
            <div className="container px-4 md:px-6">
              <ScaleIn>
                <div className="text-center mb-10">
                  <h2 id="features-heading" className="text-3xl font-bold tracking-tighter">Why Choose Us?</h2>
                  <p className="text-muted-foreground mt-2 md:text-lg">Personalized guidance, real discounts, and end-to-end support for international students.</p>
                </div>
              </ScaleIn>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Discounts & Scholarships */}
                <FeatureCard
                  title={t("home.features.discounts")}
                  description={t("home.features.discounts.desc")}
                  icon="💰"
                  delay={0.1}
                  accentColor="accent" // Gold for discounts/money
                />

                {/* Card 2: Integrity */}
                <FeatureCard
                  title={t("home.features.integrity")}
                  description={t("home.features.integrity.desc")}
                  icon="✅"
                  delay={0.2}
                  accentColor="success" // Green for integrity/trust
                />

                {/* Card 3: Personalized Matching */}
                <FeatureCard
                  title={t("home.features.matching")}
                  description={t("home.features.matching.desc")}
                  icon="🎯"
                  delay={0.3}
                  accentColor="primary" // Primary blue for core service
                />

                {/* Card 4: Complete Orientation */}
                <FeatureCard
                  title={t("home.features.orientation")}
                  description={t("home.features.orientation.desc")}
                  icon="🧭"
                  delay={0.4}
                  accentColor="tertiary" // Purple for guidance
                />

                {/* Card 5: Accommodation */}
                <FeatureCard
                  title={t("home.features.accommodation")}
                  description={t("home.features.accommodation.desc")}
                  icon="🏠"
                  delay={0.5}
                  accentColor="secondary" // Orange for housing
                />

                {/* Card 6: Lifelong Support */}
                <FeatureCard
                  title={t("home.features.support")}
                  description={t("home.features.support.desc")}
                  icon="🤝"
                  delay={0.6}
                  accentColor="primary" // Blue for support
                />
              </div>
            </div>
          </section>

          {/* Everything Handled Section */}
          <EverythingHandledSection />

          {/* Testimonials */}
          <section className="bg-muted py-16">
            <div className="container px-4 md:px-6">
              <ScaleIn>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold tracking-tighter">{t("home.testimonials.title")}</h2>
                  <p className="text-muted-foreground mt-2 md:text-lg">{t("home.testimonials.subtitle")}</p>
                </div>
              </ScaleIn>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <TestimonialCard
                  quote={t(
                    "Agenta helped me find a scholarship that reduced my tuition by 50%. Their guidance throughout the application process was invaluable.",
                  )}
                  name="Maria Rodriguez"
                  country={t("Mexico")}
                  university="Istanbul Medipol University"
                  delay={0.1}
                />
                <TestimonialCard
                  quote={t(
                    "I was overwhelmed by all the options until Agenta matched me with the perfect program. Now I'm studying Computer Science at my dream university.",
                  )}
                  name="Ahmed Hassan"
                  country={t("Egypt")}
                  university="Bahçeşehir University"
                  delay={0.2}
                />
                <TestimonialCard
                  quote={t(
                    "The personalized support made my transition to studying in Turkey smooth and stress-free. I couldn't have done it without Agenta.",
                  )}
                  name="Priya Sharma"
                  country={t("India")}
                  university="Istanbul Bilgi University"
                  delay={0.3}
                />
              </div>
            </div>
          </section>

          {/* CTA Section - Updated with more engaging gradient background */}
          <section className="py-16 bg-cta-gradient text-white" aria-labelledby="cta-heading">
            <div className="container px-4 md:px-6 text-center">
              <FadeIn direction="up">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h2 id="cta-heading" className="text-3xl font-bold tracking-tighter">Ready to Start Your Turkish Adventure?</h2>
                  <p className="md:text-xl">Apply now, or chat with our advisors – your future is just one click away.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                    {/* Primary action button - using accent color for high visibility */}
                    <TrackedButton
                      size="xl"
                      variant="accent"
                      href="/apply"
                      trackingName="apply_now"
                      trackingLocation="footer_cta"
                      trackingType="cta"
                      trackingProperties={{ position: "primary", section: "footer" }}
                      aria-label="Apply now for Turkish universities"
                    >
                      Apply Now
                    </TrackedButton>
                    {/* Secondary action - using white outline for contrast */}
                    <TrackedButton
                      size="xl"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white/10"
                      href="/contact"
                      trackingName="contact_advisor"
                      trackingLocation="footer_cta"
                      trackingType="cta"
                      trackingProperties={{ position: "secondary", section: "footer" }}
                      aria-label="Contact an advisor"
                    >
                      Talk to an Advisor
                    </TrackedButton>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
      </div>
      {/* Floating Chat Widget Icon */}
      <ChatWidget />
    </PageTransition>
  )
}
