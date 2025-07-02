"use client"

import { useState, useEffect } from "react"
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, Clock, UserCheck, Users, Globe, RefreshCw, Mail, ArrowUp } from "lucide-react"

export default function PrivacyPageClient() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Shield className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            At Agenta University, we are committed to protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you visit our website or use our services.
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the site or use our services.
          </p>
          <p>
            We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert
            you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to
            periodically review this Privacy Policy to stay informed of updates.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: (
        <>
          <h4 className="text-lg font-semibold mb-2">Personal Information</h4>
          <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Register for an account</li>
            <li>Express interest in obtaining information about us or our services</li>
            <li>Participate in activities on our website</li>
            <li>Contact us</li>
          </ul>
          <p className="mb-4">The personal information we collect may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Mailing address</li>
            <li>Educational background</li>
            <li>Demographic information</li>
          </ul>

          <h4 className="text-lg font-semibold mb-2">Usage Data</h4>
          <p className="mb-4">
            We automatically collect certain information when you visit, use, or navigate our website. This information
            does not reveal your specific identity but may include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Device and browser information</li>
            <li>IP address</li>
            <li>Operating system</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
          </ul>

          <h4 className="text-lg font-semibold mb-2">Cookies and Tracking Technologies</h4>
          <p className="mb-4">
            We use cookies and similar tracking technologies to collect and store information. For more information
            about our use of cookies, please see our{" "}
            <a href="/cookies" className="text-blue-600 hover:underline">
              Cookie Policy
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing, operating, and maintaining our website and services</li>
            <li>Improving, personalizing, and expanding our website and services</li>
            <li>Understanding and analyzing how you use our website</li>
            <li>Developing new products, services, features, and functionality</li>
            <li>Communicating with you about our services, updates, and other information</li>
            <li>Processing applications and enrollment</li>
            <li>Sending administrative information</li>
            <li>Responding to inquiries and providing customer support</li>
            <li>Marketing and promotional purposes (with your consent)</li>
            <li>Protecting our rights and preventing fraud</li>
          </ul>
        </>
      ),
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: <Users className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">We may share your information in the following situations:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors, service
              providers, contractors, or agents who perform services for us.
            </li>
            <li>
              <strong>With Business Partners:</strong> We may share your information with our business partners to offer
              you certain products, services, or promotions.
            </li>
            <li>
              <strong>With Affiliated Universities:</strong> We may share your information with universities and
              educational institutions that are part of our network.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your information for any other purpose with your
              consent.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or in
              response to valid requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or
              during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion
              of our business.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            We have implemented appropriate technical and organizational security measures designed to protect the
            security of any personal information we process. However, despite our safeguards and efforts to secure your
            information, no electronic transmission over the Internet or information storage technology can be
            guaranteed to be 100% secure.
          </p>
          <p>
            We will do our best to protect your personal information, but transmission of personal information to and
            from our website is at your own risk. You should only access the website within a secure environment.
          </p>
        </>
      ),
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Clock className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this
            Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete
            or anonymize it, or, if this is not possible, then we will securely store your personal information and
            isolate it from any further processing until deletion is possible.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: <UserCheck className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Access:</strong> You have the right to request copies of your personal information.
            </li>
            <li>
              <strong>Rectification:</strong> You have the right to request that we correct any information you believe
              is inaccurate or complete information you believe is incomplete.
            </li>
            <li>
              <strong>Erasure:</strong> You have the right to request that we erase your personal information, under
              certain conditions.
            </li>
            <li>
              <strong>Restrict Processing:</strong> You have the right to request that we restrict the processing of
              your personal information, under certain conditions.
            </li>
            <li>
              <strong>Object to Processing:</strong> You have the right to object to our processing of your personal
              information, under certain conditions.
            </li>
            <li>
              <strong>Data Portability:</strong> You have the right to request that we transfer the data we have
              collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>
          <p>
            If you wish to exercise any of these rights, please contact us using the contact information provided below.
          </p>
        </>
      ),
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      icon: <Users className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            Our website and services are not intended for individuals under the age of 18. We do not knowingly collect
            personal information from children under 18. If you are a parent or guardian and you are aware that your
            child has provided us with personal information, please contact us so that we can take necessary actions.
          </p>
        </>
      ),
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Globe className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            Your information may be transferred to, and maintained on, computers located outside of your state,
            province, country, or other governmental jurisdiction where the data protection laws may differ from those
            in your jurisdiction.
          </p>
          <p>
            If you are located outside Turkey and choose to provide information to us, please note that we transfer the
            data, including personal data, to Turkey and process it there. Your consent to this Privacy Policy followed
            by your submission of such information represents your agreement to that transfer.
          </p>
        </>
      ),
    },
    {
      id: "changes-to-policy",
      title: "Changes to This Policy",
      icon: <RefreshCw className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>
        </>
      ),
    },
    {
      id: "contact-us",
      title: "Contact Us",
      icon: <Mail className="h-6 w-6" />,
      content: (
        <>
          <p className="mb-4">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mb-4">
            <p>
              <strong>Agenta University</strong>
            </p>
            <p>Email: privacy@agentauniversity.com</p>
            <p>Phone: +90 212 555 1234</p>
            <p>Address: 123 University Avenue, Istanbul, Turkey</p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Contact Us
          </a>
        </>
      ),
    },
  ]

  return (
    <>
      <Header />
      <div className="relative">
        {/* Hero Section */}
        <div className="relative bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] bg-cover opacity-20"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500/20 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-indigo-500/20 animate-float-delayed"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-purple-500/20 animate-float-slow"></div>

          <div className="container mx-auto px-4 py-16 relative z-20">
            <FadeIn>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-shadow-lg">
                  Privacy Policy
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto text-shadow">
                  Learn how Agenta University collects, uses, and protects your personal information
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            <ScaleIn className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:sticky lg:top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Contents</h2>
                  <button
                    onClick={() => window.print()}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                </div>
                <nav>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          onClick={() => scrollToSection(section.id)}
                          className={`block px-2 py-1 rounded-md text-sm transition-colors ${
                            activeSection === section.id
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-l-4 border-blue-500"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </ScaleIn>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <StaggerContainer className="space-y-8">
                {sections.map((section, index) => (
                  <StaggerItem key={section.id}>
                    <section id={section.id} className="scroll-mt-24">
                      <Card className="overflow-hidden border-t-4 border-primary hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                              {section.icon}
                            </div>
                            <h2 className="text-2xl font-bold">{section.title}</h2>
                          </div>
                          <div className="prose dark:prose-invert max-w-none">{section.content}</div>
                        </div>
                      </Card>
                    </section>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Back to Top Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                  Back to Top
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Add a text-shadow utility class
const styles = `
  .text-shadow-lg {
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
  }

  .animate-float {
    animation: float 6s infinite alternate ease-in-out;
  }

  .animate-float-delayed {
    animation: float 8s infinite alternate ease-in-out;
  }

  .animate-float-slow {
    animation: float 10s infinite alternate ease-in-out;
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-20px);
    }
  }
`

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style")
  styleElement.innerHTML = styles
  document.head.appendChild(styleElement)
}
