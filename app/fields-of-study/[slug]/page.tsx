"use client"

import { Header } from "@/components/header"
import { PageTransition } from "@/components/ui/animated"
import { CustomButton } from "@/components/custom-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, DollarSign, Globe, Briefcase, CheckCircle, Award, Building } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UniversityCard } from "@/components/university-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Sample fields of study data (same as in fields-of-study/page.tsx)
const fieldsOfStudy = [
  {
    id: 1,
    slug: "medicine",
    name: "Medicine",
    description:
      "Medical education in Turkey offers comprehensive training in diagnosis, treatment, and prevention of diseases with modern facilities and clinical experience.",
    image: "/placeholder.svg?height=600&width=800&query=medical students in hospital",
    universities: 35,
    averageTuition: "$8,000 - $15,000",
    duration: "6 years",
    language: ["English", "Turkish"],
    careers: ["Physician", "Surgeon", "Medical Researcher", "Public Health Specialist"],
    featured: true,
    fullDescription: `
      <h2>Overview of Medical Education in Turkey</h2>
      <p>Medical education in Turkey follows international standards and provides students with comprehensive training in the diagnosis, treatment, and prevention of diseases. Turkish medical schools combine theoretical knowledge with practical clinical experience, preparing graduates for successful careers in various healthcare settings.</p>
      
      <p>The medical curriculum in Turkey typically spans six years, divided into preclinical and clinical phases. The preclinical phase focuses on basic medical sciences, while the clinical phase involves rotations through different medical specialties in teaching hospitals.</p>
      
      <h2>Curriculum Structure</h2>
      <p>The medical curriculum in Turkish universities typically includes:</p>
      <ul>
        <li><strong>Year 1-2:</strong> Basic medical sciences (anatomy, physiology, biochemistry, histology)</li>
        <li><strong>Year 3:</strong> Pathology, pharmacology, microbiology, and introduction to clinical medicine</li>
        <li><strong>Year 4-6:</strong> Clinical rotations in internal medicine, surgery, pediatrics, obstetrics and gynecology, psychiatry, and other specialties</li>
        <li><strong>Final Year:</strong> Internship with increased clinical responsibilities</li>
      </ul>
      
      <h2>Teaching Methods</h2>
      <p>Turkish medical schools employ various teaching methods, including:</p>
      <ul>
        <li>Lectures and seminars</li>
        <li>Laboratory work</li>
        <li>Problem-based learning</li>
        <li>Clinical skills training</li>
        <li>Bedside teaching</li>
        <li>Research projects</li>
      </ul>
      
      <h2>Facilities and Resources</h2>
      <p>Medical students in Turkey have access to modern facilities and resources, including:</p>
      <ul>
        <li>Well-equipped laboratories</li>
        <li>Anatomy and simulation centers</li>
        <li>Digital learning platforms</li>
        <li>Medical libraries</li>
        <li>Teaching hospitals with diverse patient populations</li>
        <li>Research centers</li>
      </ul>
      
      <h2>Admission Requirements</h2>
      <p>International students applying to medical programs in Turkey typically need to meet the following requirements:</p>
      <ul>
        <li>High school diploma with strong background in biology, chemistry, and physics</li>
        <li>Competitive GPA (typically 3.0 or higher on a 4.0 scale)</li>
        <li>English proficiency (for English-taught programs)</li>
        <li>Entrance examination (varies by university)</li>
        <li>Letters of recommendation</li>
        <li>Statement of purpose</li>
        <li>Interview (for some universities)</li>
      </ul>
      
      <h2>Career Opportunities</h2>
      <p>Graduates of medical programs in Turkey have various career paths available to them:</p>
      <ul>
        <li>Clinical practice in hospitals or private clinics</li>
        <li>Specialization through residency programs</li>
        <li>Academic and research positions</li>
        <li>Public health and preventive medicine</li>
        <li>International healthcare organizations</li>
        <li>Pharmaceutical industry</li>
        <li>Medical education</li>
      </ul>
      
      <h2>Specialization Options</h2>
      <p>After completing medical school, graduates can pursue specialization in various fields, including:</p>
      <ul>
        <li>Internal Medicine</li>
        <li>Surgery</li>
        <li>Pediatrics</li>
        <li>Obstetrics and Gynecology</li>
        <li>Psychiatry</li>
        <li>Radiology</li>
        <li>Anesthesiology</li>
        <li>Dermatology</li>
        <li>Neurology</li>
        <li>Cardiology</li>
        <li>And many other specialties and subspecialties</li>
      </ul>
      
      <h2>Advantages of Studying Medicine in Turkey</h2>
      <p>There are several advantages to pursuing medical education in Turkey:</p>
      <ul>
        <li>Internationally recognized degrees</li>
        <li>Affordable tuition compared to Western countries</li>
        <li>Modern medical facilities and teaching hospitals</li>
        <li>Diverse patient population providing broad clinical experience</li>
        <li>Opportunity to learn in a multicultural environment</li>
        <li>Possibility to learn Turkish, which can be an advantage for those planning to practice in Turkey</li>
        <li>Strategic location between Europe and Asia, offering unique perspectives on healthcare</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      <p>Prospective medical students should also be aware of certain challenges:</p>
      <ul>
        <li>Rigorous and demanding curriculum</li>
        <li>Language considerations (especially for Turkish-taught programs)</li>
        <li>Cultural adjustment</li>
        <li>Recognition of the degree in other countries (students should research requirements for practicing in their home countries)</li>
        <li>Competitive admission process</li>
      </ul>
      
      <h2>Scholarships and Financial Aid</h2>
      <p>Various scholarship opportunities are available for international medical students in Turkey:</p>
      <ul>
        <li>Türkiye Scholarships (government-funded)</li>
        <li>University-specific scholarships</li>
        <li>Merit-based tuition discounts</li>
        <li>Research assistantships</li>
        <li>Country-specific scholarships</li>
        <li>International organization scholarships</li>
      </ul>
    `,
    topUniversities: [
      {
        id: 1,
        name: "Hacettepe University",
        location: "Ankara",
        image: "/placeholder.svg?height=400&width=600&query=hacettepe university medical faculty",
        programs: 85,
        faculties: 14,
        ranking: 1,
      },
      {
        id: 2,
        name: "Istanbul University",
        location: "Istanbul",
        image: "/placeholder.svg?height=400&width=600&query=istanbul university cerrahpasa medical faculty",
        programs: 120,
        faculties: 15,
        ranking: 2,
      },
      {
        id: 3,
        name: "Ankara University",
        location: "Ankara",
        image: "/placeholder.svg?height=400&width=600&query=ankara university medical faculty",
        programs: 95,
        faculties: 12,
        ranking: 3,
      },
    ],
  },
  {
    id: 2,
    slug: "engineering",
    name: "Engineering",
    description:
      "Engineering programs in Turkey provide strong theoretical foundations and practical skills across various specializations with industry connections.",
    image: "/placeholder.svg?height=600&width=800&query=engineering students working on project",
    universities: 65,
    averageTuition: "$3,500 - $12,000",
    duration: "4 years",
    language: ["English", "Turkish"],
    careers: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Software Engineer"],
    featured: true,
    fullDescription: `
      <h2>Overview of Engineering Education in Turkey</h2>
      <p>Engineering education in Turkey has a strong reputation for excellence, combining theoretical knowledge with practical applications. Turkish engineering programs are designed to meet international standards and prepare students for successful careers in various engineering disciplines.</p>
      
      <p>Most engineering programs in Turkey are four-year undergraduate degrees, with options for further specialization through master's and doctoral studies. The curriculum typically includes a foundation in mathematics and sciences, followed by specialized courses in the chosen engineering field.</p>
      
      <h2>Engineering Disciplines</h2>
      <p>Turkish universities offer a wide range of engineering disciplines, including:</p>
      <ul>
        <li><strong>Civil Engineering:</strong> Focuses on the design, construction, and maintenance of the built environment</li>
        <li><strong>Mechanical Engineering:</strong> Deals with the design, manufacturing, and maintenance of mechanical systems</li>
        <li><strong>Electrical Engineering:</strong> Concentrates on electrical systems, electronics, and power generation</li>
        <li><strong>Computer Engineering:</strong> Combines computer science with electronic engineering principles</li>
        <li><strong>Chemical Engineering:</strong> Applies chemistry, physics, and mathematics to chemical processes</li>
        <li><strong>Industrial Engineering:</strong> Focuses on optimizing complex processes and systems</li>
        <li><strong>Aerospace Engineering:</strong> Specializes in aircraft and spacecraft design</li>
        <li><strong>Biomedical Engineering:</strong> Applies engineering principles to medicine and biology</li>
        <li><strong>Environmental Engineering:</strong> Addresses environmental challenges through engineering solutions</li>
        <li><strong>Materials Engineering:</strong> Studies the properties and applications of various materials</li>
      </ul>
      
      <h2>Curriculum Structure</h2>
      <p>The engineering curriculum in Turkish universities typically includes:</p>
      <ul>
        <li><strong>Year 1:</strong> Foundation courses in mathematics, physics, chemistry, and introduction to engineering</li>
        <li><strong>Year 2:</strong> Core engineering principles and beginning of specialization</li>
        <li><strong>Year 3:</strong> Advanced specialized courses and laboratory work</li>
        <li><strong>Year 4:</strong> Specialized electives, capstone projects, and often industry internships</li>
      </ul>
      
      <h2>Teaching Methods</h2>
      <p>Engineering education in Turkey employs various teaching methods, including:</p>
      <ul>
        <li>Lectures and seminars</li>
        <li>Laboratory experiments</li>
        <li>Computer simulations</li>
        <li>Project-based learning</li>
        <li>Industry internships</li>
        <li>Research projects</li>
        <li>Design competitions</li>
      </ul>
      
      <h2>Facilities and Resources</h2>
      <p>Engineering students in Turkey have access to modern facilities and resources, including:</p>
      <ul>
        <li>Well-equipped laboratories</li>
        <li>Computer-aided design (CAD) facilities</li>
        <li>Prototyping and manufacturing workshops</li>
        <li>Research centers</li>
        <li>Industry collaboration hubs</li>
        <li>Technical libraries</li>
        <li>Software and simulation tools</li>
      </ul>
      
      <h2>Admission Requirements</h2>
      <p>International students applying to engineering programs in Turkey typically need to meet the following requirements:</p>
      <ul>
        <li>High school diploma with strong background in mathematics and sciences</li>
        <li>Competitive GPA (typically 2.5 or higher on a 4.0 scale)</li>
        <li>English proficiency (for English-taught programs)</li>
        <li>Entrance examination (varies by university)</li>
        <li>Letters of recommendation</li>
        <li>Statement of purpose</li>
      </ul>
      
      <h2>Career Opportunities</h2>
      <p>Graduates of engineering programs in Turkey have various career paths available to them:</p>
      <ul>
        <li>Design and development roles in engineering firms</li>
        <li>Project management</li>
        <li>Research and development</li>
        <li>Consulting</li>
        <li>Manufacturing and production</li>
        <li>Quality assurance and testing</li>
        <li>Technical sales and support</li>
        <li>Entrepreneurship and innovation</li>
        <li>Academia and research institutions</li>
      </ul>
      
      <h2>Industry Connections</h2>
      <p>Many engineering programs in Turkey have strong connections with industry partners, providing students with:</p>
      <ul>
        <li>Internship opportunities</li>
        <li>Industry-sponsored projects</li>
        <li>Guest lectures from industry professionals</li>
        <li>Site visits and field trips</li>
        <li>Career fairs and networking events</li>
        <li>Research collaborations</li>
      </ul>
      
      <h2>Advantages of Studying Engineering in Turkey</h2>
      <p>There are several advantages to pursuing engineering education in Turkey:</p>
      <ul>
        <li>Strong technical education with practical focus</li>
        <li>Affordable tuition compared to Western countries</li>
        <li>Modern facilities and laboratories</li>
        <li>Growing industrial sector providing job opportunities</li>
        <li>Strategic location between Europe and Asia</li>
        <li>Opportunity to participate in major infrastructure and development projects</li>
        <li>Internationally recognized degrees</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      <p>Prospective engineering students should also be aware of certain challenges:</p>
      <ul>
        <li>Rigorous curriculum requiring strong mathematical and analytical skills</li>
        <li>Language considerations (especially for Turkish-taught programs)</li>
        <li>Varying quality between universities (research accreditation and rankings)</li>
        <li>Recognition of the degree in other countries (students should research requirements for practicing in their home countries)</li>
      </ul>
      
      <h2>Scholarships and Financial Aid</h2>
      <p>Various scholarship opportunities are available for international engineering students in Turkey:</p>
      <ul>
        <li>Türkiye Scholarships (government-funded)</li>
        <li>University-specific scholarships</li>
        <li>Merit-based tuition discounts</li>
        <li>Research assistantships</li>
        <li>Industry-sponsored scholarships</li>
        <li>International organization scholarships</li>
      </ul>
    `,
    topUniversities: [
      {
        id: 1,
        name: "Middle East Technical University",
        location: "Ankara",
        image: "/placeholder.svg?height=400&width=600&query=middle east technical university engineering",
        programs: 110,
        faculties: 13,
        ranking: 1,
      },
      {
        id: 2,
        name: "Istanbul Technical University",
        location: "Istanbul",
        image: "/placeholder.svg?height=400&width=600&query=istanbul technical university campus",
        programs: 115,
        faculties: 13,
        ranking: 2,
      },
      {
        id: 3,
        name: "Boğaziçi University",
        location: "Istanbul",
        image: "/placeholder.svg?height=400&width=600&query=bogazici university engineering faculty",
        programs: 70,
        faculties: 9,
        ranking: 3,
      },
    ],
  },
  // Other fields would be defined here with similar structure
]

export default function FieldOfStudyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [field, setField] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch field details
    const timer = setTimeout(() => {
      const foundField = fieldsOfStudy.find((f) => f.slug === slug)
      setField(foundField || null)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    )
  }

  if (!field) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Field of Study Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The field of study you're looking for doesn't exist or has been removed.
            </p>
            <CustomButton href="/fields-of-study">Browse All Fields</CustomButton>
          </div>
        </main>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative">
            <div className="relative h-[300px] md:h-[400px]">
              <Image src={field.image || "/placeholder.svg"} alt={field.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
            </div>

            <div className="container px-4 md:px-6 relative -mt-32 mb-8">
              <div className="max-w-4xl mx-auto">
                <Link
                  href="/fields-of-study"
                  className="inline-flex items-center text-sm text-white hover:text-secondary mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Fields of Study
                </Link>
                <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{field.name}</h1>
                  <p className="text-muted-foreground mb-6">{field.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Building className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Universities</span>
                      <span className="font-medium">{field.universities}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Clock className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{field.duration}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <DollarSign className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Avg. Tuition</span>
                      <span className="font-medium">{field.averageTuition}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Globe className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <span className="font-medium">{field.language.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-8">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="overview">
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="universities">Top Universities</TabsTrigger>
                    <TabsTrigger value="careers">Career Paths</TabsTrigger>
                    <TabsTrigger value="admission">Admission</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 md:p-8">
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: field.fullDescription }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="universities" className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">Top Universities for {field.name}</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {field.topUniversities.map((university: any, index: number) => (
                          <UniversityCard
                            key={university.id}
                            id={university.id}
                            name={university.name}
                            location={university.location}
                            image={university.image}
                            programs={university.programs}
                            faculties={university.faculties}
                            type={university.type || 'Public'}  
                            ranking={university.ranking}
                            languages={university.languages || ['English']}
                            delay={index * 0.1}
                          />
                        ))}
                      </div>

                      <div className="mt-8 text-center">
                        <CustomButton href="/universities" variant="outline">
                          View All Universities Offering {field.name}
                        </CustomButton>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="careers" className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">Career Opportunities in {field.name}</h2>

                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          Graduates with a degree in {field.name} from Turkish universities have access to diverse
                          career opportunities both in Turkey and internationally. Here are some of the common career
                          paths:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                          {field.careers.map((career: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="mr-4 mt-1">
                                <Briefcase className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium mb-2">{career}</h3>
                                <p className="text-sm text-muted-foreground">{getCareerDescription(career)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-muted p-6 rounded-lg mt-6">
                          <h3 className="text-lg font-medium mb-3">Job Market Outlook</h3>
                          <p className="text-muted-foreground mb-4">
                            The job market for {field.name} graduates in Turkey is {getJobMarketOutlook(field.name)}.
                            With Turkey's growing economy and development in various sectors, qualified professionals in
                            this field are in demand both locally and internationally.
                          </p>
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">Average starting salary: {getAverageSalary(field.name)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="admission" className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">Admission Requirements for {field.name}</h2>

                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          Admission requirements for {field.name} programs in Turkish universities may vary, but
                          generally include the following:
                        </p>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Academic Requirements</p>
                              <p className="text-sm text-muted-foreground">
                                High school diploma or equivalent with a strong background in{" "}
                                {getRequiredSubjects(field.name)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Language Proficiency</p>
                              <p className="text-sm text-muted-foreground">
                                For English-taught programs: TOEFL (minimum 75-80) or IELTS (minimum 6.0-6.5)
                                <br />
                                For Turkish-taught programs: TÖMER certificate (Turkish language proficiency)
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Entrance Examinations</p>
                              <p className="text-sm text-muted-foreground">
                                Some universities require YÖS (Foreign Student Exam) or accept SAT, ACT, or other
                                international examinations
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Application Documents</p>
                              <p className="text-sm text-muted-foreground">
                                Completed application form, academic transcripts, copy of passport, passport-sized
                                photographs, letter of intent/motivation, letters of recommendation
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Additional Requirements</p>
                              <p className="text-sm text-muted-foreground">
                                Some programs may require interviews, portfolios, or additional subject-specific tests
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted p-6 rounded-lg mt-6">
                          <h3 className="text-lg font-medium mb-3">Application Timeline</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                                1
                              </div>
                              <div>
                                <p className="font-medium">Research and Choose Universities</p>
                                <p className="text-xs text-muted-foreground">10-12 months before intended start date</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                                2
                              </div>
                              <div>
                                <p className="font-medium">Prepare Required Documents</p>
                                <p className="text-xs text-muted-foreground">6-8 months before intended start date</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                                3
                              </div>
                              <div>
                                <p className="font-medium">Submit Applications</p>
                                <p className="text-xs text-muted-foreground">
                                  Fall semester: February-June, Spring semester: October-December
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                                4
                              </div>
                              <div>
                                <p className="font-medium">Receive Acceptance and Apply for Visa</p>
                                <p className="text-xs text-muted-foreground">3-4 months before intended start date</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                                5
                              </div>
                              <div>
                                <p className="font-medium">Prepare for Arrival</p>
                                <p className="text-xs text-muted-foreground">1-2 months before intended start date</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-cta-gradient text-white">
            <div className="container px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Study {field.name} in Turkey?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
                Let Agenta help you find the perfect university and program that matches your academic goals and
                preferences.
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

// Helper functions for dynamic content
function getCareerDescription(career: string): string {
  const descriptions: { [key: string]: string } = {
    Physician:
      "Work in hospitals, clinics, or private practice diagnosing and treating patients with various medical conditions.",
    Surgeon: "Perform surgical procedures in hospitals or specialized surgical centers.",
    "Medical Researcher":
      "Conduct research in laboratories, universities, or pharmaceutical companies to advance medical knowledge.",
    "Public Health Specialist":
      "Work with government agencies or NGOs to improve community health and prevent disease.",
    "Civil Engineer":
      "Design, develop, and supervise infrastructure projects like buildings, bridges, and water systems.",
    "Mechanical Engineer": "Design and develop mechanical devices, engines, and manufacturing systems.",
    "Electrical Engineer": "Work with electrical systems, electronics, and power generation technologies.",
    "Software Engineer": "Design, develop, and maintain software applications and systems.",
    "Business Manager": "Oversee operations, strategy, and personnel in various organizations.",
    "Marketing Specialist": "Develop and implement marketing strategies to promote products and services.",
    Entrepreneur: "Start and manage your own business ventures.",
    Consultant: "Provide expert advice to organizations on improving their performance.",
  }

  return descriptions[career] || "Work in specialized roles requiring expertise in this field."
}

function getJobMarketOutlook(field: string): string {
  const outlooks: { [key: string]: string } = {
    Medicine: "strong and growing, with consistent demand for healthcare professionals",
    Engineering: "robust, particularly in civil infrastructure, energy, and technology sectors",
    "Business Administration":
      "diverse and competitive, with opportunities in both Turkish and international companies",
  }

  return outlooks[field] || "promising, with various opportunities in both public and private sectors"
}

function getAverageSalary(field: string): string {
  const salaries: { [key: string]: string } = {
    Medicine: "$1,500 - $3,000 per month (entry-level)",
    Engineering: "$1,200 - $2,500 per month (entry-level)",
    "Business Administration": "$1,000 - $2,200 per month (entry-level)",
  }

  return salaries[field] || "$1,000 - $2,000 per month (entry-level)"
}

function getRequiredSubjects(field: string): string {
  const subjects: { [key: string]: string } = {
    Medicine: "biology, chemistry, and physics",
    Engineering: "mathematics, physics, and chemistry",
    "Business Administration": "mathematics, economics, and business studies",
  }

  return subjects[field] || "relevant subjects for this field"
}
