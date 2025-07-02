"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, FileText, Shield, User, Book, AlertTriangle, Scale, Globe, Mail, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  FloatingAnimation,
  PulseAnimation,
} from "@/components/ui/animated"

interface Section {
  id: string
  title: string
  icon: React.ReactNode
}

export default function TermsPageClient() {
  const [activeSection, setActiveSection] = useState("")

  const sections: Section[] = [
    { id: "introduction", title: "Introduction", icon: <FileText className="h-4 w-4" /> },
    { id: "acceptance", title: "Acceptance of Terms", icon: <ChevronRight className="h-4 w-4" /> },
    { id: "eligibility", title: "User Eligibility", icon: <User className="h-4 w-4" /> },
    { id: "accounts", title: "User Accounts", icon: <User className="h-4 w-4" /> },
    { id: "intellectual-property", title: "Intellectual Property", icon: <Book className="h-4 w-4" /> },
    { id: "user-content", title: "User Content", icon: <FileText className="h-4 w-4" /> },
    { id: "prohibited", title: "Prohibited Activities", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "disclaimer", title: "Disclaimer of Warranties", icon: <Shield className="h-4 w-4" /> },
    { id: "liability", title: "Limitation of Liability", icon: <Shield className="h-4 w-4" /> },
    { id: "indemnification", title: "Indemnification", icon: <Scale className="h-4 w-4" /> },
    { id: "governing-law", title: "Governing Law", icon: <Globe className="h-4 w-4" /> },
    { id: "changes", title: "Changes to Terms", icon: <FileText className="h-4 w-4" /> },
    { id: "contact", title: "Contact Us", icon: <Mail className="h-4 w-4" /> },
  ]

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      const currentSection = sections
        .map((section) => {
          const element = document.getElementById(section.id)
          if (!element) return { id: section.id, position: -1 }
          return {
            id: section.id,
            position: element.offsetTop,
          }
        })
        .filter((section) => section.position <= scrollPosition)
        .sort((a, b) => b.position - a.position)[0]

      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection, sections])

  // Scroll to section when clicking on TOC link
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Print the terms page
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16 bg-university-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10 bg-cover bg-center"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary/40"></div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-secondary/20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/20 blur-xl"></div>

          <FloatingAnimation className="absolute top-40 right-20">
            <div className="w-16 h-16 rounded-full bg-secondary/30"></div>
          </FloatingAnimation>

          <FloatingAnimation className="absolute bottom-20 left-1/4">
            <div className="w-12 h-12 rounded-full bg-accent/30"></div>
          </FloatingAnimation>

          <div className="container px-4 md:px-6 relative z-10">
            <FadeIn className="mx-auto max-w-3xl text-center space-y-3">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Terms of Service</h1>
              <p className="text-white/80 max-w-[700px] mx-auto text-sm">
                Please read these terms carefully before using our platform.
              </p>
              <p className="text-xs text-white/60">Last updated: May 13, 2025</p>
            </FadeIn>
          </div>
        </section>

        <section className="w-full py-8 relative">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-full"></div>

          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Table of Contents - Sticky on desktop */}
              <div className="md:col-span-3">
                <ScaleIn>
                  <Card className="sticky top-24 border-l-4 border-l-primary shadow-lg">
                    <CardContent className="p-3">
                      <h3 className="text-base font-semibold mb-3 text-primary">Contents</h3>
                      <nav className="space-y-0.5">
                        {sections.map((section) => (
                          <Button
                            key={section.id}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start gap-2 text-xs py-1 h-auto ${
                              activeSection === section.id
                                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-2"
                                : ""
                            }`}
                            onClick={() => scrollToSection(section.id)}
                          >
                            {section.icon}
                            <span>{section.title}</span>
                          </Button>
                        ))}
                      </nav>
                      <div className="mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-2 text-muted-foreground text-xs"
                          onClick={handlePrint}
                        >
                          <Printer className="h-3 w-3" />
                          Print Terms
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleIn>
              </div>

              {/* Main Content */}
              <div className="md:col-span-9 space-y-6">
                <StaggerContainer className="space-y-6" delay={0.1} staggerDelay={0.05}>
                  <StaggerItem>
                    <section id="introduction" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5 text-secondary" />
                        1. Introduction
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              Welcome to Agenta University ("we," "our," or "us"). These Terms of Service ("Terms")
                              govern your access to and use of the Agenta University website, including any content,
                              functionality, and services offered on or through agenta.edu (the "Service").
                            </p>
                            <p>
                              Please read these Terms carefully before using our Service. By accessing or using the
                              Service, you agree to be bound by these Terms. If you do not agree to these Terms, you
                              must not access or use the Service.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="acceptance" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <ChevronRight className="h-5 w-5 text-secondary" />
                        2. Acceptance of Terms
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed max-w-prose">
                            <p>
                              By accessing or using our Service, you confirm that you are at least 18 years old, or that
                              you are at least 13 years old and have your parent or guardian's permission to use the
                              Service. If you are accessing or using the Service on behalf of a company, organization,
                              or other legal entity, you represent and warrant that you have the authority to bind that
                              entity to these Terms, in which case "you" refers to that entity.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="eligibility" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <User className="h-5 w-5 text-secondary" />
                        3. User Eligibility
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed max-w-prose">
                            <p>
                              Our Service is intended for users who are seeking information about universities in
                              Turkey. You must be at least 13 years of age to use our Service. If you are under 18, you
                              must have permission from a parent or guardian to use our Service.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="accounts" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <User className="h-5 w-5 text-secondary" />
                        4. User Accounts
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              When you create an account with us, you must provide accurate, complete, and current
                              information. You are responsible for safeguarding the password that you use to access the
                              Service and for any activities or actions under your password.
                            </p>
                            <p>
                              You agree not to disclose your password to any third party. You must notify us immediately
                              upon becoming aware of any breach of security or unauthorized use of your account.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="intellectual-property" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Book className="h-5 w-5 text-secondary" />
                        5. Intellectual Property
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              The Service and its original content, features, and functionality are and will remain the
                              exclusive property of Agenta University and its licensors. The Service is protected by
                              copyright, trademark, and other laws of both Turkey and foreign countries.
                            </p>
                            <p>
                              Our trademarks and trade dress may not be used in connection with any product or service
                              without the prior written consent of Agenta University.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="user-content" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5 text-secondary" />
                        6. User Content
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              Our Service may allow you to post, link, store, share and otherwise make available certain
                              information, text, graphics, videos, or other material ("User Content"). You are
                              responsible for the User Content that you post on or through the Service, including its
                              legality, reliability, and appropriateness.
                            </p>
                            <p>
                              By posting User Content on or through the Service, you grant us the right to use, modify,
                              publicly perform, publicly display, reproduce, and distribute such User Content on and
                              through the Service. You retain any and all of your rights to any User Content you submit,
                              post, or display on or through the Service and you are responsible for protecting those
                              rights.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="prohibited" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <AlertTriangle className="h-5 w-5 text-secondary" />
                        7. Prohibited Activities
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              You may not access or use the Service for any purpose other than that for which we make
                              the Service available. The Service may not be used in connection with any commercial
                              endeavors except those that are specifically endorsed or approved by us.
                            </p>
                            <p>As a user of the Service, you agree not to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>
                                Systematically retrieve data or other content from the Service to create or compile,
                                directly or indirectly, a collection, compilation, database, or directory without
                                written permission from us.
                              </li>
                              <li>
                                Make any unauthorized use of the Service, including collecting usernames and/or email
                                addresses of users by electronic or other means for the purpose of sending unsolicited
                                email, or creating user accounts by automated means or under false pretenses.
                              </li>
                              <li>Use the Service to advertise or offer to sell goods and services.</li>
                              <li>
                                Circumvent, disable, or otherwise interfere with security-related features of the
                                Service.
                              </li>
                              <li>Engage in unauthorized framing of or linking to the Service.</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="disclaimer" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5 text-secondary" />
                        8. Disclaimer of Warranties
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided
                              without warranties of any kind, whether express or implied, including, but not limited to,
                              implied warranties of merchantability, fitness for a particular purpose, non-infringement,
                              or course of performance.
                            </p>
                            <p>
                              Agenta University, its subsidiaries, affiliates, and its licensors do not warrant that a)
                              the Service will function uninterrupted, secure, or available at any particular time or
                              location; b) any errors or defects will be corrected; c) the Service is free of viruses or
                              other harmful components; or d) the results of using the Service will meet your
                              requirements.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="liability" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5 text-secondary" />
                        9. Limitation of Liability
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed max-w-prose">
                            <p>
                              In no event shall Agenta University, nor its directors, employees, partners, agents,
                              suppliers, or affiliates, be liable for any indirect, incidental, special, consequential,
                              or punitive damages, including without limitation, loss of profits, data, use, goodwill,
                              or other intangible losses, resulting from (i) your access to or use of or inability to
                              access or use the Service; (ii) any conduct or content of any third party on the Service;
                              (iii) any content obtained from the Service; and (iv) unauthorized access, use, or
                              alteration of your transmissions or content, whether based on warranty, contract, tort
                              (including negligence), or any other legal theory, whether or not we have been informed of
                              the possibility of such damage.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="indemnification" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5 text-secondary" />
                        10. Indemnification
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed max-w-prose">
                            <p>
                              You agree to defend, indemnify, and hold harmless Agenta University, its parent,
                              subsidiaries, affiliates, and all of their respective officers, agents, partners, and
                              employees, from and against any loss, damage, liability, claim, or demand, including
                              reasonable attorneys' fees and expenses, made by any third party due to or arising out of:
                              (1) your use of the Service; (2) breach of these Terms; (3) any breach of your
                              representations and warranties set forth in these Terms; (4) your violation of the rights
                              of a third party, including but not limited to intellectual property rights; or (5) any
                              overt harmful act toward any other user of the Service with whom you connected via the
                              Service.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="governing-law" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Globe className="h-5 w-5 text-secondary" />
                        11. Governing Law
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed max-w-prose">
                            <p>
                              These Terms shall be governed and construed in accordance with the laws of Turkey, without
                              regard to its conflict of law provisions. Our failure to enforce any right or provision of
                              these Terms will not be considered a waiver of those rights.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="changes" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5 text-secondary" />
                        12. Changes to Terms
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>
                              We reserve the right, at our sole discretion, to modify or replace these Terms at any
                              time. If a revision is material, we will try to provide at least 30 days' notice prior to
                              any new terms taking effect. What constitutes a material change will be determined at our
                              sole discretion.
                            </p>
                            <p>
                              By continuing to access or use our Service after those revisions become effective, you
                              agree to be bound by the revised terms. If you do not agree to the new terms, please stop
                              using the Service.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <section id="contact" className="scroll-mt-24 space-y-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Mail className="h-5 w-5 text-secondary" />
                        13. Contact Us
                      </h2>
                      <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-1 bg-gradient-to-r from-secondary to-accent"></div>
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed space-y-3 max-w-prose">
                            <p>If you have any questions about these Terms, please contact us at:</p>
                            <div className="bg-muted p-3 rounded-lg text-sm">
                              <p>
                                <strong>Email:</strong> legal@agenta.edu
                                <br />
                                <strong>Address:</strong> Istanbul, Turkey
                              </p>
                            </div>
                            <div className="pt-3">
                              <PulseAnimation>
                                <Button
                                  asChild
                                  size="sm"
                                  className="bg-secondary hover:bg-secondary/90 text-white text-xs"
                                >
                                  <Link href="/contact">Contact Us</Link>
                                </Button>
                              </PulseAnimation>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </StaggerItem>
                </StaggerContainer>

                {/* Back to top button */}
                <FadeIn delay={0.5}>
                  <div className="flex justify-center pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="group hover:bg-primary hover:text-white transition-all duration-300 text-xs"
                    >
                      <span className="mr-2 group-hover:translate-y-[-2px] transition-transform duration-300">↑</span>
                      Back to Top
                    </Button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
