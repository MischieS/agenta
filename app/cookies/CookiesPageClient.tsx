"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import {
  CookieIcon,
  InfoIcon,
  SettingsIcon,
  AlertTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  PrinterIcon,
  ExternalLinkIcon,
  ListIcon,
  MailIcon,
} from "lucide-react"

export default function CookiesPageClient() {
  const [activeSection, setActiveSection] = useState("")
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Register section refs
  const registerSection = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref
    }
  }

  // Handle printing
  const handlePrint = () => {
    window.print()
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      // Find the current section
      let currentSection = ""
      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentSection = id
        }
      })

      if (currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection])

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <FadeIn>
        <div className="relative overflow-hidden bg-primary text-white py-16 print:py-8 print:text-black print:bg-white">
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>

          <div className="absolute inset-0 opacity-10">
            <Image src="/abstract-geometric-flow.png" alt="Background pattern" fill className="object-cover" priority />
          </div>

          <div className="container px-4 md:px-6 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block p-2 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                <CookieIcon className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-shadow">
                Cookies Policy
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 text-shadow">
                How we use cookies to improve your experience on our website
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-white/30 backdrop-blur-sm">
                  Last Updated: May 13, 2025
                </span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 animate-float-slow opacity-20 print:hidden z-0">
            <div className="w-20 h-20 rounded-full bg-orange-500/30 blur-xl"></div>
          </div>
          <div className="absolute bottom-1/4 right-10 animate-float opacity-20 print:hidden z-0">
            <div className="w-32 h-32 rounded-full bg-blue-500/30 blur-xl"></div>
          </div>
        </div>
      </FadeIn>

      <div className="container px-4 md:px-6 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <ScaleIn className="print:hidden">
            <div className="lg:sticky lg:top-24 lg:self-start rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Table of Contents</h3>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <PrinterIcon className="w-4 h-4 mr-1" />
                    Print
                  </button>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {[
                    { id: "introduction", label: "Introduction" },
                    { id: "what-are-cookies", label: "What Are Cookies?" },
                    { id: "types-of-cookies", label: "Types of Cookies" },
                    { id: "how-we-use-cookies", label: "How We Use Cookies" },
                    { id: "third-party-cookies", label: "Third-Party Cookies" },
                    { id: "managing-cookies", label: "Managing Cookies" },
                    { id: "changes", label: "Changes to This Policy" },
                    { id: "contact", label: "Contact Us" },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center transition-colors ${
                          activeSection === item.id
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <ListIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </ScaleIn>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <StaggerContainer className="space-y-8">
              {/* Introduction */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("introduction", el)}
                  id="introduction"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <InfoIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
                        <p className="mt-4 text-muted-foreground">
                          Agenta University ("we", "our", or "us") uses cookies and similar technologies on our website.
                          This Cookies Policy explains how we use cookies, how they help us improve your experience, and
                          the choices you have regarding their use.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          By using our website, you consent to the use of cookies in accordance with this policy. If you
                          do not agree with our use of cookies, you should set your browser settings accordingly or not
                          use our website.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* What Are Cookies */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("what-are-cookies", el)}
                  id="what-are-cookies"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                        <CookieIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">What Are Cookies?</h2>
                        <p className="mt-4 text-muted-foreground">
                          Cookies are small text files that are placed on your device when you visit a website. They are
                          widely used to make websites work more efficiently and provide information to the website
                          owners.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          Cookies help websites remember information about your visit, such as your preferred language
                          and other settings. This can make your next visit easier and the site more useful to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Types of Cookies */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("types-of-cookies", el)}
                  id="types-of-cookies"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-yellow-500 to-green-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                        <SettingsIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Types of Cookies</h2>
                        <p className="mt-4 text-muted-foreground">We use different types of cookies on our website:</p>
                        <div className="mt-4 space-y-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium flex items-center">
                              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                              Essential Cookies
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              These cookies are necessary for the website to function properly. They enable basic
                              functions like page navigation and access to secure areas of the website. The website
                              cannot function properly without these cookies.
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium flex items-center">
                              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                              Preference Cookies
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              These cookies allow the website to remember choices you make (such as your preferred
                              language or the region you are in) and provide enhanced, more personal features.
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium flex items-center">
                              <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                              Analytics Cookies
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              These cookies collect information about how visitors use our website, such as which pages
                              visitors go to most often and if they receive error messages. These cookies don't collect
                              information that identifies a visitor.
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium flex items-center">
                              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                              Marketing Cookies
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              These cookies are used to track visitors across websites. The intention is to display ads
                              that are relevant and engaging for the individual user and thereby more valuable for
                              publishers and third-party advertisers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* How We Use Cookies */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("how-we-use-cookies", el)}
                  id="how-we-use-cookies"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">How We Use Cookies</h2>
                        <p className="mt-4 text-muted-foreground">We use cookies for various purposes, including:</p>
                        <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
                          <li>To provide and maintain our services</li>
                          <li>To authenticate users and prevent fraud</li>
                          <li>To remember your preferences and settings</li>
                          <li>To analyze how our website is used so we can improve it</li>
                          <li>To personalize your experience</li>
                          <li>To measure the effectiveness of our marketing campaigns</li>
                        </ul>
                        <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 text-sm">
                          <h3 className="font-medium text-blue-700 dark:text-blue-300">Cookie Duration</h3>
                          <p className="mt-1 text-blue-600 dark:text-blue-400">
                            Session cookies: These cookies are temporary and expire once you close your browser.
                            <br />
                            Persistent cookies: These cookies remain on your device until they expire or you delete
                            them.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Third-Party Cookies */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("third-party-cookies", el)}
                  id="third-party-cookies"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                        <ExternalLinkIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Third-Party Cookies</h2>
                        <p className="mt-4 text-muted-foreground">
                          In addition to our own cookies, we may also use various third-party cookies to report usage
                          statistics, deliver advertisements, and so on.
                        </p>
                        <div className="mt-4 space-y-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium">Analytics Providers</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              We use Google Analytics to help us understand how our website is being used. These cookies
                              may track things such as how long you spend on the site and the pages that you visit.
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium">Social Media</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              We use social media buttons and/or plugins on this site that allow you to connect with
                              your social network in various ways. These will set cookies through our site which may be
                              used to enhance your profile on their site or contribute to the data they hold.
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium">Advertising Partners</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Some of our advertising partners may use cookies and web beacons on our site. Our
                              advertising partners include Google Ads and Facebook Ads.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Managing Cookies */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("managing-cookies", el)}
                  id="managing-cookies"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                        <SettingsIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Managing Cookies</h2>
                        <p className="mt-4 text-muted-foreground">
                          Most web browsers allow you to control cookies through their settings preferences. However, if
                          you limit the ability of websites to set cookies, you may worsen your overall user experience.
                        </p>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium">Browser Settings</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              You can manage cookies through your browser settings. Here are links to instructions for
                              common browsers:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li>
                                <a
                                  href="https://support.google.com/chrome/answer/95647"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Google Chrome
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Mozilla Firefox
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Safari
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Microsoft Edge
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h3 className="font-medium">Opt-Out Options</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              You can opt out of third-party cookies used for advertising purposes through:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li>
                                <a
                                  href="https://www.youronlinechoices.eu/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Your Online Choices (EU)
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://optout.aboutads.info/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Digital Advertising Alliance
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://tools.google.com/dlpage/gaoptout"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center"
                                >
                                  Google Analytics Opt-out
                                  <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-sm">
                          <h3 className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center">
                            <AlertTriangleIcon className="w-4 h-4 mr-1" />
                            Important Note
                          </h3>
                          <p className="mt-1 text-yellow-600 dark:text-yellow-400">
                            Please be aware that restricting cookies may impact the functionality of our website. Many
                            of our services will not function properly if your browser does not accept cookies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Changes to This Policy */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("changes", el)}
                  id="changes"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-pink-500 to-red-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-pink-500/10 text-pink-500">
                        <ClockIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Changes to This Policy</h2>
                        <p className="mt-4 text-muted-foreground">
                          We may update our Cookies Policy from time to time. We will notify you of any changes by
                          posting the new Cookies Policy on this page and updating the "Last Updated" date at the top of
                          this policy.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          You are advised to review this Cookies Policy periodically for any changes. Changes to this
                          Cookies Policy are effective when they are posted on this page.
                        </p>
                        <div className="mt-4 p-4 rounded-lg bg-muted/50">
                          <h3 className="font-medium">Version History</h3>
                          <ul className="mt-2 space-y-2 text-sm">
                            <li className="flex items-start">
                              <span className="font-medium mr-2">May 13, 2025:</span>
                              <span className="text-muted-foreground">Initial Cookies Policy published.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Contact Us */}
              <StaggerItem>
                <div
                  ref={(el) => registerSection("contact", el)}
                  id="contact"
                  className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative h-2 bg-gradient-to-r from-red-500 to-blue-500"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                        <MailIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Contact Us</h2>
                        <p className="mt-4 text-muted-foreground">
                          If you have any questions about our Cookies Policy, please contact us:
                        </p>
                        <ul className="mt-4 space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <span className="font-medium mr-2">Email:</span>
                            <a href="mailto:privacy@agenta.edu" className="text-primary hover:underline">
                              privacy@agenta.edu
                            </a>
                          </li>
                          <li className="flex items-center">
                            <span className="font-medium mr-2">Address:</span>
                            <span>Istanbul, Turkey</span>
                          </li>
                        </ul>
                        <div className="mt-6">
                          <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring animate-pulse"
                          >
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Back to Top Button */}
            <div className="flex justify-center mt-12 print:hidden">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center justify-center rounded-full p-3 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Back to top"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add a text-shadow utility class
const styles = `
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
`

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style")
  styleElement.innerHTML = styles
  document.head.appendChild(styleElement)
}
