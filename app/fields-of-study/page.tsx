"use client"

import { PageTransition, FadeIn } from "@/components/ui/animated"
import { CustomButton } from "@/components/custom-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, BookOpen, GraduationCap, Building, Clock, ArrowRight, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Sample fields of study data
const fieldsOfStudy = [
  {
    id: 1,
    slug: "medicine",
    name: "Medicine",
    description:
      "Medical education in Turkey offers comprehensive training in diagnosis, treatment, and prevention of diseases with modern facilities and clinical experience.",
    image: "/placeholder.svg?key=la4rb",
    universities: 35,
    averageTuition: "$8,000 - $15,000",
    duration: "6 years",
    language: ["English", "Turkish"],
    careers: ["Physician", "Surgeon", "Medical Researcher", "Public Health Specialist"],
    featured: true,
  },
  {
    id: 2,
    slug: "engineering",
    name: "Engineering",
    description:
      "Engineering programs in Turkey provide strong theoretical foundations and practical skills across various specializations with industry connections.",
    image: "/engineering-students-project.png",
    universities: 65,
    averageTuition: "$3,500 - $12,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Software Engineer"],
    featured: true,
  },
  {
    id: 3,
    slug: "business-administration",
    name: "Business Administration",
    description:
      "Business programs in Turkey focus on management principles, economics, marketing, and entrepreneurship with a global perspective.",
    image: "/business-students-presentation.png",
    universities: 70,
    averageTuition: "$3,000 - $10,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Business Manager", "Marketing Specialist", "Entrepreneur", "Consultant"],
    featured: true,
  },
  {
    id: 4,
    slug: "computer-science",
    name: "Computer Science",
    description:
      "Computer Science education in Turkey covers programming, algorithms, artificial intelligence, and software development with modern computing facilities.",
    image: "/placeholder.svg?key=yqk9j",
    universities: 55,
    averageTuition: "$3,500 - $11,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Software Developer", "Data Scientist", "System Analyst", "IT Consultant"],
    featured: false,
  },
  {
    id: 5,
    slug: "architecture",
    name: "Architecture",
    description:
      "Architecture programs in Turkey blend historical context with modern design principles, offering exposure to diverse architectural styles and urban planning.",
    image: "/placeholder.svg?key=3jif2",
    universities: 40,
    averageTuition: "$4,000 - $12,000",
    duration: "5 years",
    language: ["English", "Turkish"],
    careers: ["Architect", "Urban Planner", "Interior Designer", "Restoration Specialist"],
    featured: false,
  },
  {
    id: 6,
    slug: "law",
    name: "Law",
    description:
      "Law education in Turkey provides comprehensive understanding of legal systems, with focus on both Turkish and international law principles.",
    image: "/law-students-library.png",
    universities: 30,
    averageTuition: "$3,000 - $9,000",
    duration: "4 years",
    language: ["Turkish", "English (limited programs)"],
    careers: ["Lawyer", "Legal Consultant", "Judge", "Corporate Legal Advisor"],
    featured: false,
  },
  {
    id: 7,
    slug: "dentistry",
    name: "Dentistry",
    description:
      "Dentistry programs in Turkey offer hands-on clinical experience with modern dental technologies and comprehensive theoretical knowledge.",
    image: "/placeholder.svg?key=xpj4d",
    universities: 25,
    averageTuition: "$7,000 - $14,000",
    duration: "5 years",
    language: ["English", "Turkish"],
    careers: ["Dentist", "Orthodontist", "Oral Surgeon", "Dental Researcher"],
    featured: false,
  },
  {
    id: 8,
    slug: "psychology",
    name: "Psychology",
    description:
      "Psychology education in Turkey covers human behavior, mental processes, and therapeutic approaches with research opportunities and practical training.",
    image: "/placeholder.svg?key=t9jnt",
    universities: 45,
    averageTuition: "$3,000 - $8,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Psychologist", "Counselor", "Researcher", "Human Resources Specialist"],
    featured: false,
  },
  {
    id: 9,
    slug: "tourism-and-hospitality",
    name: "Tourism and Hospitality",
    description:
      "Tourism programs in Turkey provide practical skills in hospitality management, tourism operations, and cultural heritage with internship opportunities.",
    image: "/placeholder-gj9h3.png",
    universities: 50,
    averageTuition: "$2,500 - $7,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Hotel Manager", "Tour Operator", "Event Planner", "Tourism Consultant"],
    featured: false,
  },
  {
    id: 10,
    slug: "international-relations",
    name: "International Relations",
    description:
      "International Relations programs in Turkey focus on global politics, diplomacy, and cross-cultural understanding with Turkey's unique geopolitical perspective.",
    image: "/placeholder.svg?height=600&width=800&query=international relations seminar",
    universities: 35,
    averageTuition: "$3,000 - $9,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Diplomat", "Policy Analyst", "International Organization Officer", "Political Consultant"],
    featured: false,
  },
  {
    id: 11,
    slug: "pharmacy",
    name: "Pharmacy",
    description:
      "Pharmacy education in Turkey covers pharmaceutical sciences, medication management, and patient care with laboratory and clinical training.",
    image: "/placeholder.svg?height=600&width=800&query=pharmacy students in laboratory",
    universities: 20,
    averageTuition: "$5,000 - $12,000",
    duration: "5 years",
    language: ["English", "Turkish"],
    careers: ["Pharmacist", "Pharmaceutical Researcher", "Clinical Pharmacist", "Regulatory Affairs Specialist"],
    featured: false,
  },
  {
    id: 12,
    slug: "fine-arts",
    name: "Fine Arts",
    description:
      "Fine Arts programs in Turkey nurture creativity and artistic skills across various mediums, influenced by rich cultural heritage and contemporary trends.",
    image: "/placeholder.svg?height=600&width=800&query=art students painting studio",
    universities: 30,
    averageTuition: "$2,500 - $8,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Artist", "Designer", "Art Director", "Art Educator"],
    featured: false,
  },
]

export default function FieldsOfStudyPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter fields based on search term
  const filteredFields = fieldsOfStudy.filter((field) => {
    return (
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Separate featured fields
  const featuredFields = fieldsOfStudy.filter((field) => field.featured)

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        {/* This page correctly uses the header from the layout */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-university-gradient text-white py-12 md:py-20">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Fields of Study in Turkey
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Explore the diverse academic disciplines offered by Turkish universities and find your perfect program
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search fields of study..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-6 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white focus:bg-white/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Fields */}
          {featuredFields.length > 0 && !searchTerm && (
            <section className="py-12 bg-muted">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold mb-8">Popular Fields of Study</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {featuredFields.map((field) => (
                    <FadeIn key={field.id} direction="up">
                      <Link href={`/fields-of-study/${field.slug}`} className="group block">
                        <div className="bg-card rounded-lg overflow-hidden shadow-sm border h-full transition-all duration-200 group-hover:shadow-md">
                          <div className="relative h-60">
                            <Image
                              src={field.image || "/placeholder.svg"}
                              alt={field.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-2xl font-bold text-white mb-2">{field.name}</h3>
                              <div className="flex items-center text-white/90 text-sm">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                <span>{field.universities} Universities</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <p className="text-muted-foreground mb-4 line-clamp-2">{field.description}</p>
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-primary mr-1" />
                                <span>{field.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-primary font-medium">View Details</span>
                                <ArrowRight className="h-4 w-4 text-primary ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Fields */}
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">All Fields of Study</h2>
                <p className="text-muted-foreground">
                  {filteredFields.length} {filteredFields.length === 1 ? "field" : "fields"}
                </p>
              </div>

              {filteredFields.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFields.map((field, index) => (
                    <FadeIn key={field.id} direction="up" delay={index * 0.1}>
                      <Link href={`/fields-of-study/${field.slug}`} className="group block h-full">
                        <div className="bg-card rounded-lg overflow-hidden shadow-sm border h-full transition-all duration-200 group-hover:shadow-md">
                          <div className="relative h-48">
                            <Image
                              src={field.image || "/placeholder.svg"}
                              alt={field.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3">
                              <h3 className="text-xl font-bold text-white">{field.name}</h3>
                            </div>
                          </div>
                          <div className="p-5">
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{field.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                              <div className="flex items-center">
                                <Building className="h-3 w-3 text-primary mr-1" />
                                <span>{field.universities} Universities</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 text-primary mr-1" />
                                <span>{field.duration}</span>
                              </div>
                              <div className="flex items-center col-span-2">
                                <BookOpen className="h-3 w-3 text-primary mr-1" />
                                <span>{field.language.join(", ")}</span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <span className="text-xs text-primary font-medium group-hover:underline flex items-center">
                                View Details
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted rounded-lg">
                  <div className="mb-4 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No fields found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                  <CustomButton onClick={() => setSearchTerm("")}>Reset Search</CustomButton>
                </div>
              )}
            </div>
          </section>

          {/* Why Study in Turkey */}
          <section className="py-12 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Why Study in Turkey?</h2>
                <p className="text-muted-foreground">
                  Turkey offers a unique blend of quality education, affordable tuition, and rich cultural experiences
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-center mb-2">Quality Education</h3>
                    <p className="text-center text-muted-foreground">
                      Turkish universities offer internationally recognized degrees with modern facilities and
                      experienced faculty.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl text-secondary">$</span>
                    </div>
                    <h3 className="text-xl font-medium text-center mb-2">Affordable Tuition</h3>
                    <p className="text-center text-muted-foreground">
                      Study at a fraction of the cost compared to Western countries without compromising on quality.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                      <Globe className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-medium text-center mb-2">Cultural Experience</h3>
                    <p className="text-center text-muted-foreground">
                      Immerse yourself in a unique blend of Eastern and Western cultures with rich history and
                      traditions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-cta-gradient text-white">
            <div className="container px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Educational Journey?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
                Let Agenta help you find the perfect field of study and university in Turkey that matches your interests
                and career goals.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <CustomButton variant="accent" size="xl" href="/contact">
                  Get Personalized Guidance
                </CustomButton>
                <CustomButton
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  size="xl"
                  href="/universities"
                >
                  Browse Universities
                </CustomButton>
              </div>
            </div>
          </section>
        </main>
        <ScrollToTop />
      </div>
    </PageTransition>
  )
}
