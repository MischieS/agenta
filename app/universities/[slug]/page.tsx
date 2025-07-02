"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PageTransition } from "@/components/ui/animated"
import { CustomButton } from "@/components/custom-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "@/components/interactive-map"
import {
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  Globe,
  DollarSign,
  Building,
  Users,
  Award,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample nearby attractions data
const nearbyAttractionsData = {
  "istanbul-medipol-universitesi": [
    {
      id: "rest1",
      name: "Medipol Restaurant",
      category: "restaurant",
      latitude: 41.0132,
      longitude: 28.977,
      description: "Traditional Turkish cuisine with a view of the campus",
    },
    {
      id: "cafe1",
      name: "Campus Café",
      category: "cafe",
      latitude: 41.0115,
      longitude: 28.9783,
      description: "Cozy café with modern decor",
    },
    {
      id: "lib1",
      name: "Medipol Library",
      category: "library",
      latitude: 41.0105,
      longitude: 28.965,
      description: "One of the largest medical libraries in Turkey",
    },
    {
      id: "acc1",
      name: "Student Dormitory",
      category: "accommodation",
      latitude: 41.0145,
      longitude: 28.973,
      description: "University-affiliated student housing",
    },
    {
      id: "shop1",
      name: "Shopping Mall",
      category: "shopping",
      latitude: 41.0108,
      longitude: 28.968,
      description: "Modern shopping mall with various stores",
    },
    {
      id: "trans1",
      name: "Metro Station",
      category: "transportation",
      latitude: 41.01,
      longitude: 28.97,
      description: "Convenient metro connection to other parts of the city",
    },
    {
      id: "ent1",
      name: "Cinema",
      category: "entertainment",
      latitude: 41.0086,
      longitude: 28.9802,
      description: "Modern cinema with multiple screens",
    },
  ],
  "bahcesehir-universitesi": [
    {
      id: "rest2",
      name: "Bahçeşehir Restaurant",
      category: "restaurant",
      latitude: 41.0344,
      longitude: 28.861,
      description: "Famous for authentic Turkish cuisine",
    },
    {
      id: "cafe2",
      name: "Academic Café",
      category: "cafe",
      latitude: 41.0324,
      longitude: 28.8587,
      description: "Popular student hangout with great coffee",
    },
    {
      id: "lib2",
      name: "Bahçeşehir Library",
      category: "library",
      latitude: 41.0315,
      longitude: 28.862,
      description: "Modern library with extensive collection",
    },
    {
      id: "acc2",
      name: "Student Dormitories",
      category: "accommodation",
      latitude: 41.035,
      longitude: 28.863,
      description: "Student housing complex near campus",
    },
    {
      id: "shop2",
      name: "Shopping District",
      category: "shopping",
      latitude: 41.02,
      longitude: 28.854,
      description: "Main shopping area with stores and boutiques",
    },
    {
      id: "trans2",
      name: "Metro Station",
      category: "transportation",
      latitude: 41.032,
      longitude: 28.856,
      description: "Metro connection to city center and other districts",
    },
    {
      id: "ent2",
      name: "Theater",
      category: "entertainment",
      latitude: 41.028,
      longitude: 28.855,
      description: "Cultural venue hosting plays and performances",
    },
  ],
}

// Sample university data (updated to match the private universities)
const universities = [
  {
    id: 1,
    name: "İstanbul Medipol Üniversitesi",
    slug: "istanbul-medipol-universitesi",
    location: "Istanbul",
    coordinates: {
      latitude: 41.0122,
      longitude: 28.976,
    },
    image: "/placeholder.svg?key=medipol",
    programs: 95,
    faculties: 12,
    tuitionRange: [7000, 18000],
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 8,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Health Sciences", "Engineering"],
    description:
      "Istanbul Medipol University is one of Turkey's leading private educational institutions. Founded in 2009, it offers a wide range of programs across multiple disciplines and is known for its strong medical and health sciences departments.",
    foundedYear: 2009,
    totalStudents: 30000,
    internationalStudents: 3000,
    campusSize: "Modern urban campus",
    accommodationOptions: ["On-campus dormitories", "Off-campus housing assistance"],
    applicationDeadlines: {
      fall: "June 30",
      spring: "December 15",
    },
    admissionRequirements: [
      "High school diploma or equivalent",
      "Transcript of records",
      "Language proficiency (English/Turkish)",
      "Entrance examination",
      "Letter of motivation",
    ],
    scholarshipOptions: [
      "Merit-based scholarships",
      "Need-based financial aid",
      "International student scholarships",
      "Research assistantships",
    ],
    popularPrograms: ["Medicine", "Dentistry", "Pharmacy", "Nursing", "Physiotherapy"],
    facilities: ["Modern libraries", "Research laboratories", "Sports complexes", "Student centers", "Health services"],
    contactInfo: {
      email: "admissions@medipol.edu.tr",
      phone: "+90 212 440 0000",
      address: "Istanbul Medipol University, Kavacık, 34810 Beykoz/Istanbul, Turkey",
      website: "https://www.medipol.edu.tr/en",
    },
  },
  {
    id: 2,
    name: "Bahçeşehir Üniversitesi",
    slug: "bahcesehir-universitesi",
    location: "Istanbul",
    coordinates: {
      latitude: 41.0334,
      longitude: 28.8597,
    },
    image: "/placeholder.svg?key=bahcesehir",
    programs: 95,
    faculties: 12,
    tuitionRange: [8000, 20000],
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 5,
    fields: ["Medicine", "Engineering", "Law", "Communication", "Architecture"],
    description:
      "Bahçeşehir University is a leading private institution in Istanbul. Established in 1998, it has a strong reputation in engineering, law, and communication. The university maintains close ties with industry and offers students unique opportunities for internships and research.",
    foundedYear: 1998,
    totalStudents: 25000,
    internationalStudents: 4000,
    campusSize: "Multiple campuses throughout Istanbul",
    accommodationOptions: ["University dormitories", "Private dormitories", "Apartment rentals"],
    applicationDeadlines: {
      fall: "July 15",
      spring: "January 15",
    },
    admissionRequirements: [
      "High school diploma",
      "Academic transcripts",
      "Language proficiency test",
      "Entrance exam results",
      "Passport and visa documentation",
    ],
    scholarshipOptions: [
      "Academic achievement scholarships",
      "Sports scholarships",
      "Cultural exchange scholarships",
      "Government-sponsored scholarships",
    ],
    popularPrograms: ["Engineering", "Law", "Communication", "Architecture", "Business Administration"],
    facilities: [
      "Extensive law library",
      "Engineering research centers",
      "Media production studios",
      "Modern lecture halls",
      "Student clubs and organizations",
    ],
    contactInfo: {
      email: "info@bahcesehir.edu.tr",
      phone: "+90 212 381 0000",
      address: "Bahçeşehir University, Çırağan Caddesi, 34353 Beşiktaş/Istanbul, Turkey",
      website: "https://www.bahcesehir.edu.tr/en",
    },
  },
  // Add more universities with detailed information...
]

export default function UniversityDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [university, setUniversity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nearbyAttractions, setNearbyAttractions] = useState<any[]>([])

  useEffect(() => {
    // Simulate API call to fetch university details
    const timer = setTimeout(() => {
      const foundUniversity = universities.find((uni) => uni.slug === slug)
      setUniversity(foundUniversity || null)

      // Set nearby attractions if available
      if (foundUniversity && nearbyAttractionsData[foundUniversity.slug as keyof typeof nearbyAttractionsData]) {
        setNearbyAttractions(nearbyAttractionsData[foundUniversity.slug as keyof typeof nearbyAttractionsData])
      } else {
        setNearbyAttractions([])
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">University Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The university you're looking for doesn't exist or has been removed.
            </p>
            <CustomButton href="/universities">Browse All Universities</CustomButton>
          </div>
        </main>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative">
            <div className="relative h-[300px] md:h-[400px]">
              <Image
                src={university.image || "/placeholder.svg"}
                alt={university.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            <div className="container px-4 md:px-6 relative -mt-24 mb-8">
              <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Link
                      href="/universities"
                      className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Universities
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">{university.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{university.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        <span>{university.type}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Award className="h-4 w-4 mr-1" />
                        <span>Ranking: #{university.ranking}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Founded: {university.foundedYear}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <CustomButton variant="secondary" size="lg">
                      Apply Now
                    </CustomButton>
                    <CustomButton variant="outline" size="lg">
                      Request Information
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* University Details */}
          <section className="py-8">
            <div className="container px-4 md:px-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-1 space-y-6">
                  {/* Quick Facts */}
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Students</p>
                          <p className="text-muted-foreground text-sm">
                            {university.totalStudents.toLocaleString()} total
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {university.internationalStudents.toLocaleString()} international
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Campus</p>
                          <p className="text-muted-foreground text-sm">{university.campusSize}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Programs & Faculties</p>
                          <p className="text-muted-foreground text-sm">{university.programs} programs</p>
                          <p className="text-muted-foreground text-sm">{university.faculties} faculties</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Languages</p>
                          <p className="text-muted-foreground text-sm">{university.languages.join(", ")}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Tuition Range</p>
                          <p className="text-muted-foreground text-sm">
                            ${university.tuitionRange[0].toLocaleString()} - $
                            {university.tuitionRange[1].toLocaleString()} per year
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Application Deadlines</p>
                          <p className="text-muted-foreground text-sm">Fall: {university.applicationDeadlines.fall}</p>
                          <p className="text-muted-foreground text-sm">
                            Spring: {university.applicationDeadlines.spring}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-3 text-sm">
                      <p className="font-medium">Email:</p>
                      <p className="text-primary">{university.contactInfo.email}</p>

                      <p className="font-medium">Phone:</p>
                      <p>{university.contactInfo.phone}</p>

                      <p className="font-medium">Address:</p>
                      <p className="text-muted-foreground">{university.contactInfo.address}</p>

                      <p className="font-medium">Website:</p>
                      <a
                        href={university.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        {university.contactInfo.website}
                      </a>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Location & Nearby Attractions</h2>
                    {university.coordinates && (
                      <InteractiveMap
                        latitude={university.coordinates.latitude}
                        longitude={university.coordinates.longitude}
                        universityName={university.name}
                        height="350px"
                        nearbyAttractions={nearbyAttractions}
                      />
                    )}
                    <p className="text-sm text-muted-foreground mt-3">
                      Toggle categories to explore different points of interest near {university.name}.
                    </p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                  <Tabs defaultValue="overview">
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="programs">Programs</TabsTrigger>
                      <TabsTrigger value="admission">Admission</TabsTrigger>
                      <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">About {university.name}</h2>
                        <p className="text-muted-foreground">{university.description}</p>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Fields of Study</h2>
                        <div className="flex flex-wrap gap-2">
                          {university.fields.map((field: string) => (
                            <span key={field} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Accommodation Options</h2>
                        <ul className="space-y-2">
                          {university.accommodationOptions.map((option: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="programs" className="space-y-6">
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Popular Programs</h2>
                        <ul className="space-y-3">
                          {university.popularPrograms.map((program: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">{program}</p>
                                <p className="text-sm text-muted-foreground">
                                  Bachelor's, Master's, and PhD programs available
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">All Programs</h2>
                          <span className="text-sm text-muted-foreground">{university.programs} total programs</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {university.name} offers a wide range of undergraduate and graduate programs across various
                          disciplines.
                        </p>
                        <CustomButton variant="outline">View All Programs</CustomButton>
                      </div>
                    </TabsContent>

                    <TabsContent value="admission" className="space-y-6">
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Admission Requirements</h2>
                        <ul className="space-y-2">
                          {university.admissionRequirements.map((requirement: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Scholarship Opportunities</h2>
                        <ul className="space-y-2">
                          {university.scholarshipOptions.map((scholarship: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                              <span>{scholarship}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Application Process</h2>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Create an Account</p>
                              <p className="text-sm text-muted-foreground">
                                Register on the university's application portal
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Complete Application Form</p>
                              <p className="text-sm text-muted-foreground">
                                Fill out personal information and academic history
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Upload Required Documents</p>
                              <p className="text-sm text-muted-foreground">
                                Submit transcripts, language certificates, and other required documents
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Pay Application Fee</p>
                              <p className="text-sm text-muted-foreground">
                                Complete payment of the non-refundable application fee
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                              5
                            </div>
                            <div>
                              <p className="font-medium">Await Decision</p>
                              <p className="text-sm text-muted-foreground">
                                Application review typically takes 4-6 weeks
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="facilities" className="space-y-6">
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Campus Facilities</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {university.facilities.map((facility: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Campus Life</h2>
                        <p className="text-muted-foreground mb-4">
                          {university.name} offers a vibrant campus life with numerous student clubs, cultural events,
                          sports activities, and social gatherings throughout the academic year.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <Image src="/placeholder.svg?key=campus1" alt="Campus life" fill className="object-cover" />
                          </div>
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <Image src="/placeholder.svg?key=campus2" alt="Campus life" fill className="object-cover" />
                          </div>
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <Image src="/placeholder.svg?key=campus3" alt="Campus life" fill className="object-cover" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-cta-gradient text-white">
            <div className="container px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply to {university.name}?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
                Let Agenta help you with your application process and increase your chances of admission with our
                personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <CustomButton variant="accent" size="xl">
                  Apply with Agenta
                </CustomButton>
                <CustomButton
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  size="xl"
                >
                  Schedule a Consultation
                </CustomButton>
              </div>
            </div>
          </section>
        </main>
      </div>
      <ScrollToTop />
    </PageTransition>
  )
}
