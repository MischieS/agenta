"use client"

import { Header } from "@/components/header"
import { PageTransition } from "@/components/ui/animated"
import { CustomButton } from "@/components/custom-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Sample blog data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: 1,
    slug: "guide-to-turkish-student-visa",
    title: "Complete Guide to Turkish Student Visa Application Process",
    excerpt:
      "Everything international students need to know about applying for a student visa in Turkey, including required documents and application timeline.",
    category: "Visa Information",
    author: "Mehmet Yilmaz",
    authorRole: "Student Visa Specialist",
    authorImage: "/placeholder.svg?height=200&width=200&query=professional headshot",
    date: "May 10, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?key=gxc8z",
    featured: true,
    content: `
      <h2>Introduction to Turkish Student Visas</h2>
      <p>Turkey has become an increasingly popular destination for international students seeking quality education at affordable costs. With its rich history, strategic location between Europe and Asia, and growing number of universities offering programs in English, it's no wonder that thousands of students choose Turkey for their higher education journey each year.</p>
      <p>However, before you can begin your studies in Turkey, you'll need to obtain a student visa. This comprehensive guide will walk you through the entire process, from understanding the requirements to submitting your application and preparing for your arrival in Turkey.</p>
      
      <h2>Types of Turkish Student Visas</h2>
      <p>There are primarily two types of visas relevant for international students:</p>
      <ul>
        <li><strong>Student Visa (Öğrenci Vizesi)</strong>: This is the initial visa you'll need to enter Turkey for educational purposes. It's typically valid for a short period and allows you to enter the country.</li>
        <li><strong>Residence Permit for Education (İkamet Tezkeresi)</strong>: Once in Turkey, you'll need to apply for a residence permit within 30 days of arrival. This permit allows you to stay in Turkey for the duration of your studies.</li>
      </ul>
      
      <h2>Required Documents for Student Visa Application</h2>
      <p>To apply for a Turkish student visa, you'll need to prepare the following documents:</p>
      <ol>
        <li><strong>Valid Passport</strong>: Your passport must be valid for at least 60 days beyond the expiration date of your visa.</li>
        <li><strong>Visa Application Form</strong>: Completed and signed visa application form.</li>
        <li><strong>Acceptance Letter</strong>: Official acceptance letter from a Turkish university or educational institution.</li>
        <li><strong>Proof of Financial Means</strong>: Documents showing you have sufficient funds to support yourself during your stay in Turkey (bank statements, scholarship letter, etc.).</li>
        <li><strong>Health Insurance</strong>: Proof of health insurance coverage valid in Turkey.</li>
        <li><strong>Accommodation Details</strong>: Information about where you'll be staying in Turkey.</li>
        <li><strong>Passport Photos</strong>: Recent biometric photographs (typically 2-4 depending on the consulate).</li>
        <li><strong>Visa Fee Payment Receipt</strong>: Proof that you've paid the visa application fee.</li>
      </ol>
      
      <h2>Application Process Timeline</h2>
      <p>The student visa application process typically follows these steps:</p>
      <ol>
        <li><strong>University Application and Acceptance</strong>: Apply to Turkish universities and receive an acceptance letter.</li>
        <li><strong>Visa Application Submission</strong>: Submit your visa application to the Turkish embassy or consulate in your home country.</li>
        <li><strong>Visa Processing</strong>: Wait for your application to be processed (usually 2-4 weeks).</li>
        <li><strong>Visa Collection</strong>: Collect your visa once approved.</li>
        <li><strong>Travel to Turkey</strong>: Enter Turkey with your student visa.</li>
        <li><strong>Residence Permit Application</strong>: Apply for a residence permit within 30 days of arrival.</li>
      </ol>
      
      <h2>Tips for a Successful Application</h2>
      <ul>
        <li>Apply for your visa at least 1-2 months before your planned departure to Turkey.</li>
        <li>Ensure all your documents are complete and properly organized.</li>
        <li>Provide accurate and consistent information across all documents.</li>
        <li>Prepare for a possible interview at the embassy or consulate.</li>
        <li>Keep copies of all submitted documents for your records.</li>
      </ul>
      
      <h2>After Arriving in Turkey</h2>
      <p>Once you arrive in Turkey with your student visa, you'll need to:</p>
      <ol>
        <li><strong>Register with Your University</strong>: Complete the registration process at your university.</li>
        <li><strong>Apply for a Residence Permit</strong>: Submit your residence permit application through the e-ikamet system within 30 days.</li>
        <li><strong>Register for Health Insurance</strong>: Ensure your health insurance is valid or register for the Turkish health insurance system.</li>
        <li><strong>Open a Bank Account</strong>: Consider opening a Turkish bank account for easier financial transactions.</li>
      </ol>
      
      <h2>Common Challenges and Solutions</h2>
      <p>International students often face certain challenges during the visa application process. Here are some common issues and how to address them:</p>
      <ul>
        <li><strong>Language Barrier</strong>: Consider hiring a translator or asking for assistance from your university's international office.</li>
        <li><strong>Document Authentication</strong>: Some documents may need to be notarized or apostilled. Check requirements early.</li>
        <li><strong>Visa Delays</strong>: Apply well in advance to account for potential processing delays.</li>
        <li><strong>Financial Proof</strong>: Ensure your financial documents clearly show you have sufficient funds for your stay.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Obtaining a Turkish student visa is a crucial step in your journey to studying in Turkey. While the process may seem complex, proper preparation and understanding of the requirements will help ensure a smooth application experience.</p>
      <p>Remember that visa requirements and processes may change, so always check the most current information from the Turkish embassy or consulate in your country before applying.</p>
      <p>If you need personalized assistance with your visa application or have specific questions about studying in Turkey, don't hesitate to contact our team at Agenta. We're here to help you navigate every step of your educational journey in Turkey.</p>
    `,
    relatedPosts: [3, 5, 6],
  },
  {
    id: 2,
    slug: "top-engineering-programs-turkey",
    title: "Top 10 Engineering Programs in Turkish Universities",
    excerpt:
      "Discover the best engineering programs offered by Turkish universities, their strengths, and career opportunities for graduates.",
    category: "Academic Programs",
    author: "Ayşe Kaya",
    authorRole: "Education Consultant",
    authorImage: "/placeholder.svg?height=200&width=200&query=female professional",
    date: "April 22, 2023",
    readTime: "10 min read",
    image: "/placeholder.svg?key=ttz0v",
    featured: true,
    content: `
      <h2>Introduction</h2>
      <p>Turkey has established itself as a hub for quality engineering education, with numerous universities offering world-class programs that combine theoretical knowledge with practical experience. Turkish engineering graduates are sought after by employers worldwide, thanks to the rigorous curriculum and hands-on training they receive.</p>
      <p>In this article, we'll explore the top 10 engineering programs in Turkish universities, highlighting their unique strengths, specializations, and the career opportunities they open up for graduates.</p>
      
      <h2>Why Study Engineering in Turkey?</h2>
      <p>Before diving into the specific programs, let's look at what makes Turkey an excellent destination for engineering studies:</p>
      <ul>
        <li><strong>Affordable Quality Education</strong>: Turkish universities offer high-quality engineering programs at a fraction of the cost compared to Western countries.</li>
        <li><strong>Industry Connections</strong>: Many engineering programs have strong ties with industry partners, providing students with internship and job opportunities.</li>
        <li><strong>Modern Facilities</strong>: Top engineering schools in Turkey boast state-of-the-art laboratories, research centers, and technology hubs.</li>
        <li><strong>International Recognition</strong>: Degrees from accredited Turkish universities are recognized worldwide.</li>
        <li><strong>English-Taught Programs</strong>: Many engineering programs are offered entirely in English, eliminating language barriers for international students.</li>
      </ul>
      
      <h2>Top 10 Engineering Programs in Turkey</h2>
      
      <h3>1. Middle East Technical University (METU) - Electrical and Electronics Engineering</h3>
      <p><strong>Location:</strong> Ankara</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Consistently ranked as one of the top engineering programs in Turkey</li>
        <li>Strong focus on research and innovation</li>
        <li>Extensive laboratory facilities</li>
        <li>High employment rate for graduates</li>
        <li>Opportunities for international exchange programs</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates find positions in telecommunications, power systems, electronics manufacturing, and research institutions.</p>
      
      <h3>2. Boğaziçi University - Civil Engineering</h3>
      <p><strong>Location:</strong> Istanbul</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Emphasis on sustainable and earthquake-resistant construction</li>
        <li>Strong industry partnerships</li>
        <li>Advanced structural engineering laboratories</li>
        <li>Opportunities for field work and site visits</li>
        <li>Active student engineering societies</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates work in construction companies, design firms, government agencies, and consulting firms.</p>
      
      <h3>3. Istanbul Technical University (ITU) - Mechanical Engineering</h3>
      <p><strong>Location:</strong> Istanbul</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>One of the oldest and most prestigious engineering programs in Turkey</li>
        <li>Specializations in automotive, energy, and manufacturing</li>
        <li>Strong emphasis on CAD/CAM technologies</li>
        <li>Robotics and automation laboratories</li>
        <li>Industry-sponsored projects</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates find roles in automotive industry, energy sector, manufacturing, and research and development.</p>
      
      <h3>4. Bilkent University - Computer Engineering</h3>
      <p><strong>Location:</strong> Ankara</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Cutting-edge curriculum covering AI, machine learning, and cybersecurity</li>
        <li>Strong emphasis on software development</li>
        <li>Research opportunities in emerging technologies</li>
        <li>Close ties with technology companies</li>
        <li>Entrepreneurship and innovation focus</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates work in software development, IT consulting, tech startups, and research institutions.</p>
      
      <h3>5. Koç University - Industrial Engineering</h3>
      <p><strong>Location:</strong> Istanbul</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Integration of engineering with business and management principles</li>
        <li>Focus on optimization and efficiency</li>
        <li>Supply chain management specialization</li>
        <li>Data analytics and operations research</li>
        <li>Industry-sponsored projects and internships</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates find positions in logistics, manufacturing, consulting, and business analytics.</p>
      
      <h3>6. Sabancı University - Materials Science and Engineering</h3>
      <p><strong>Location:</strong> Istanbul</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Interdisciplinary approach combining physics, chemistry, and engineering</li>
        <li>Advanced materials characterization facilities</li>
        <li>Nanotechnology research opportunities</li>
        <li>Composite materials and polymers focus</li>
        <li>Industry-relevant research projects</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates work in materials development, manufacturing, research laboratories, and quality control.</p>
      
      <h3>7. Yıldız Technical University - Chemical Engineering</h3>
      <p><strong>Location:</strong> Istanbul</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Strong focus on process design and optimization</li>
        <li>Specializations in petrochemicals and pharmaceuticals</li>
        <li>Environmental engineering integration</li>
        <li>Well-equipped laboratories</li>
        <li>Industry internships</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates find roles in chemical processing, pharmaceuticals, food production, and environmental consulting.</p>
      
      <h3>8. Hacettepe University - Biomedical Engineering</h3>
      <p><strong>Location:</strong> Ankara</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Integration of engineering principles with medical sciences</li>
        <li>Medical device design and development</li>
        <li>Collaboration with university hospital</li>
        <li>Tissue engineering and biomaterials research</li>
        <li>Healthcare technology focus</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates work in medical device companies, hospitals, research institutions, and healthcare technology firms.</p>
      
      <h3>9. Ege University - Food Engineering</h3>
      <p><strong>Location:</strong> Izmir</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Focus on food processing and preservation</li>
        <li>Food safety and quality control</li>
        <li>Product development laboratories</li>
        <li>Connections with food industry</li>
        <li>Sustainable food production emphasis</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates find positions in food production companies, quality assurance, regulatory agencies, and research and development.</p>
      
      <h3>10. TOBB University of Economics and Technology - Aerospace Engineering</h3>
      <p><strong>Location:</strong> Ankara</p>
      <p><strong>Program Highlights:</strong></p>
      <ul>
        <li>Comprehensive curriculum covering aircraft and spacecraft design</li>
        <li>Aerodynamics and propulsion systems focus</li>
        <li>Flight simulation facilities</li>
        <li>Connections with Turkish aerospace industry</li>
        <li>Research opportunities in emerging aerospace technologies</li>
      </ul>
      <p><strong>Career Opportunities:</strong> Graduates work in aerospace companies, defense industry, aviation, and research institutions.</p>
      
      <h2>Admission Requirements for Engineering Programs</h2>
      <p>While specific requirements vary by university and program, here are the general admission requirements for international students applying to engineering programs in Turkey:</p>
      <ul>
        <li>High school diploma with strong background in mathematics and sciences</li>
        <li>Standardized test scores (SAT, ACT, or YÖS - Foreign Student Exam)</li>
        <li>English proficiency (TOEFL, IELTS, or university's own English exam)</li>
        <li>Letters of recommendation</li>
        <li>Statement of purpose</li>
        <li>Portfolio or additional requirements for specific engineering disciplines</li>
      </ul>
      
      <h2>Scholarships for Engineering Students</h2>
      <p>Many Turkish universities offer scholarships specifically for engineering students. Some notable scholarship opportunities include:</p>
      <ul>
        <li>Türkiye Scholarships (government-funded)</li>
        <li>University-specific merit scholarships</li>
        <li>Research assistantships</li>
        <li>Industry-sponsored scholarships</li>
        <li>International organization scholarships (ERASMUS+, etc.)</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Turkey offers a wide range of high-quality engineering programs that combine academic excellence with practical experience. Whether you're interested in traditional fields like civil or mechanical engineering, or emerging areas like biomedical or aerospace engineering, you'll find world-class programs at Turkish universities.</p>
      <p>The affordable tuition fees, modern facilities, and international recognition make Turkish engineering programs an excellent choice for students from around the world. Additionally, the strong industry connections ensure that graduates are well-prepared for successful careers in their chosen fields.</p>
      <p>If you're considering studying engineering in Turkey and need personalized guidance on choosing the right program or university, contact our team at Agenta. We're here to help you navigate your educational journey and find the perfect engineering program to match your interests and career goals.</p>
    `,
    relatedPosts: [4, 7, 8],
  },
  // Other blog posts would be defined here
]

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch blog post
    const timer = setTimeout(() => {
      const foundPost = blogPosts.find((p) => p.slug === slug)
      setPost(foundPost || null)

      if (foundPost && foundPost.relatedPosts) {
        const related = foundPost.relatedPosts.map((id) => blogPosts.find((p) => p.id === id)).filter(Boolean)
        setRelatedPosts(related as any[])
      }

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

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <CustomButton href="/blog">Back to Blog</CustomButton>
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
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
            </div>

            <div className="container px-4 md:px-6 relative -mt-32 mb-8">
              <div className="max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center text-sm text-white hover:text-secondary mb-4">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Blog
                </Link>
                <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border">
                  <span className="inline-block bg-primary text-white text-sm font-medium px-2.5 py-1 rounded mb-4">
                    {post.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Content */}
          <section className="py-8">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-12 gap-8">
                  {/* Main Content */}
                  <div className="md:col-span-8">
                    <div className="bg-card rounded-lg border p-6 md:p-8">
                      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                      {/* Tags */}
                      <div className="mt-8 pt-6 border-t">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium">Tags:</span>
                          <span className="bg-muted text-muted-foreground text-sm px-2.5 py-0.5 rounded">
                            Study in Turkey
                          </span>
                          <span className="bg-muted text-muted-foreground text-sm px-2.5 py-0.5 rounded">
                            {post.category}
                          </span>
                          <span className="bg-muted text-muted-foreground text-sm px-2.5 py-0.5 rounded">
                            International Students
                          </span>
                        </div>
                      </div>

                      {/* Share Buttons */}
                      <div className="mt-6 flex items-center gap-4">
                        <span className="text-sm font-medium">Share:</span>
                        <button className="text-muted-foreground hover:text-primary">
                          <Facebook className="h-5 w-5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary">
                          <Twitter className="h-5 w-5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary">
                          <Linkedin className="h-5 w-5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary">
                          <Mail className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Author Bio */}
                    <div className="bg-card rounded-lg border p-6 mt-8">
                      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={post.authorImage || "/placeholder.svg"} alt={post.author} />
                          <AvatarFallback>
                            {post.author
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">{post.author}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{post.authorRole}</p>
                          <p className="text-sm">
                            An education specialist with years of experience helping international students navigate the
                            Turkish education system. Passionate about making quality education accessible to students
                            from around the world.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                          {relatedPosts.map((relatedPost) => (
                            <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                              <div className="bg-card rounded-lg overflow-hidden shadow-sm border transition-all duration-200 group-hover:shadow-md">
                                <div className="relative h-40">
                                  <Image
                                    src={relatedPost.image || "/placeholder.svg"}
                                    alt={relatedPost.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                                    {relatedPost.title}
                                  </h3>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{relatedPost.date}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="md:col-span-4">
                    <div className="space-y-6">
                      {/* CTA Card */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-2">Need Personalized Guidance?</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Get expert advice on studying in Turkey, university selection, and application process.
                          </p>
                          <CustomButton className="w-full" variant="secondary" href="/contact">
                            Contact an Advisor
                          </CustomButton>
                        </CardContent>
                      </Card>

                      {/* Categories */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-4">Categories</h3>
                          <div className="space-y-2">
                            <Link
                              href="/blog?category=Visa Information"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Visa Information
                            </Link>
                            <Link
                              href="/blog?category=Academic Programs"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Academic Programs
                            </Link>
                            <Link
                              href="/blog?category=Student Life"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Student Life
                            </Link>
                            <Link
                              href="/blog?category=Scholarships"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Scholarships
                            </Link>
                            <Link
                              href="/blog?category=Language"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Language
                            </Link>
                            <Link
                              href="/blog?category=Culture"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Culture
                            </Link>
                            <Link
                              href="/blog?category=Career"
                              className="block text-muted-foreground hover:text-primary"
                            >
                              Career
                            </Link>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Newsletter */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-2">Subscribe to Our Newsletter</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Get the latest articles and resources directly to your inbox.
                          </p>
                          <form className="space-y-2">
                            <input
                              type="email"
                              placeholder="Your email address"
                              className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <CustomButton className="w-full" variant="accent" type="submit">
                              Subscribe
                            </CustomButton>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <ScrollToTop />
      </div>
    </PageTransition>
  )
}
