import Image from "next/image"
import Link from "next/link"
import { FadeIn, FadeInStagger } from "@/components/ui/animated"
import { Button } from "@/components/ui/button"
import { TestimonialCard } from "@/components/testimonial-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Removed the Header component from here since it's already in the layout */}

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Bridging Students to Their Future in Turkey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Agenta is dedicated to helping international students find their perfect educational path in Turkey
              through personalized guidance, transparent information, and ongoing support.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <FadeIn className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission & Vision</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-xl mb-2">Mission</h3>
                  <p className="text-muted-foreground">
                    To empower international students with accurate information, personalized guidance, and ongoing
                    support to make confident decisions about studying in Turkey.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-xl mb-2">Vision</h3>
                  <p className="text-muted-foreground">
                    To become the most trusted platform for international education in Turkey, known for our integrity,
                    student-centered approach, and commitment to educational excellence.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?key=767nt"
                alt="Students collaborating in a Turkish university"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Our Team */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Meet Our Team</h2>
          </FadeIn>

          <FadeInStagger staggerDelay={0.03}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <FadeIn key={member.name} className="bg-background rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-64 w-full">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      {member.socialLinks.map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Journey</h2>
          </FadeIn>

          <FadeInStagger>
            <div className="relative border-l-2 border-primary/30 ml-4 md:ml-0 md:mx-auto md:max-w-3xl pl-8 space-y-12">
              {historyTimeline.map((item, index) => (
                <FadeIn key={index} className="relative">
                  <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-background"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.year}</h3>
                    <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Core Values</h2>
          </FadeIn>

          <FadeInStagger staggerDelay={0.03} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <FadeIn key={value.title} className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <FadeInStagger staggerDelay={0.03} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <FadeIn key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Students Say</h2>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <FadeIn key={testimonial.name}>
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  country={testimonial.country}
                  university={testimonial.university}

                />
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Find answers to common questions about studying in Turkey and our services.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <FadeIn>
              <h3 className="text-xl font-semibold mb-4">Application Process</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqApplicationProcess.map((faq, index) => (
                  <AccordionItem key={index} value={`application-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>

            <FadeIn>
              <h3 className="text-xl font-semibold mb-4">Student Life in Turkey</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqStudentLife.map((faq, index) => (
                  <AccordionItem key={index} value={`student-life-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>

            <FadeIn>
              <h3 className="text-xl font-semibold mb-4">Costs & Scholarships</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqCostsScholarships.map((faq, index) => (
                  <AccordionItem key={index} value={`costs-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>

            <FadeIn>
              <h3 className="text-xl font-semibold mb-4">About Our Services</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqOurServices.map((faq, index) => (
                  <AccordionItem key={index} value={`services-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>

          <FadeIn className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don't see your question here? Feel free to reach out to us directly.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container px-4 md:px-6">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have found their perfect educational match in Turkey with Agenta's
              guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/universities">Explore Universities</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

// Team Members Data
import { Linkedin, Twitter, Globe } from "lucide-react"

const teamMembers = [
  {
    name: "Dr. Ayşe Yılmaz",
    role: "Founder & CEO",
    bio: "Former professor with 15+ years in international education and a passion for cultural exchange.",
    image: "/professional-woman-glasses.png",
    socialLinks: [
      { platform: "linkedin", icon: <Linkedin className="h-5 w-5" />, url: "#" },
      { platform: "twitter", icon: <Twitter className="h-5 w-5" />, url: "#" },
      { platform: "website", icon: <Globe className="h-5 w-5" />, url: "#" },
    ],
  },
  {
    name: "Mehmet Kaya",
    role: "University Relations Director",
    bio: "Builds and maintains partnerships with Turkey's top universities to secure the best opportunities for students.",
    image: "/placeholder.svg?key=8vxzm",
    socialLinks: [
      { platform: "linkedin", icon: <Linkedin className="h-5 w-5" />, url: "#" },
      { platform: "twitter", icon: <Twitter className="h-5 w-5" />, url: "#" },
    ],
  },
  {
    name: "Sophia Chen",
    role: "Student Success Manager",
    bio: "Former international student who now guides others through the application and adjustment process.",
    image: "/placeholder.svg?key=xcas0",
    socialLinks: [
      { platform: "linkedin", icon: <Linkedin className="h-5 w-5" />, url: "#" },
      { platform: "twitter", icon: <Twitter className="h-5 w-5" />, url: "#" },
    ],
  },
  {
    name: "Omar Al-Farsi",
    role: "Academic Advisor",
    bio: "Specializes in helping students find programs that align with their career goals and academic strengths.",
    image: "/placeholder.svg?key=tpcn7",
    socialLinks: [
      { platform: "linkedin", icon: <Linkedin className="h-5 w-5" />, url: "#" },
      { platform: "website", icon: <Globe className="h-5 w-5" />, url: "#" },
    ],
  },
]

// History Timeline
const historyTimeline = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "Agenta was founded by Dr. Ayşe Yılmaz after recognizing the challenges international students faced when applying to Turkish universities.",
  },
  {
    year: "2019",
    title: "First Partnerships",
    description:
      "Established official partnerships with 5 leading universities in Istanbul and Ankara, creating direct application channels for students.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "Launched our comprehensive online platform during the pandemic, allowing students to research and apply to universities remotely.",
  },
  {
    year: "2021",
    title: "Expansion",
    description:
      "Expanded our services to include scholarship guidance, visa support, and pre-arrival orientation for incoming students.",
  },
  {
    year: "2022",
    title: "Nationwide Coverage",
    description:
      "Reached partnerships with universities in all 7 regions of Turkey, offering students options throughout the country.",
  },
  {
    year: "2023",
    title: "Today",
    description:
      "Now serving students from over 50 countries, with a dedicated team of advisors speaking 12 languages and partnerships with 45+ universities.",
  },
]

// Core Values
import { Users, Heart, BookOpen, GlobeIcon, Shield, Lightbulb } from "lucide-react"

const coreValues = [
  {
    title: "Student-Centered",
    description:
      "We put students' needs and goals at the center of everything we do, providing personalized guidance for each individual.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Integrity",
    description:
      "We provide honest, transparent information about universities, programs, and the application process.",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in our services, continuously improving to better serve students and university partners.",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    title: "Cultural Bridge",
    description: "We celebrate cultural diversity and help students navigate cross-cultural experiences successfully.",
    icon: <GlobeIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: "Empowerment",
    description:
      "We empower students with knowledge and support to make confident decisions about their educational future.",
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    title: "Compassion",
    description: "We approach each student's journey with empathy, understanding the challenges of studying abroad.",
    icon: <Heart className="h-6 w-6 text-primary" />,
  },
]

// Stats
const stats = [
  { value: "45+", label: "Partner Universities" },
  { value: "5,000+", label: "Students Placed" },
  { value: "50+", label: "Countries Represented" },
  { value: "98%", label: "Student Satisfaction" },
]

// Testimonials
const testimonials = [
  {
    quote:
      "Agenta made my dream of studying medicine in Turkey possible. Their guidance through the application process was invaluable.",
    name: "Ibrahim Osei",
    country: "Ghana",
    university: "Istanbul University",
  },
  {
    quote:
      "I was overwhelmed by all the university options until Agenta helped me find the perfect engineering program for my interests.",
    name: "Aisha Mahmoud",
    country: "Egypt",
    university: "Middle East Technical University"
  },
  {
    quote:
      "The scholarship guidance from Agenta saved me thousands of dollars and made my education in Turkey affordable.",
    name: "Carlos Rodriguez",
    country: "Mexico",
    university: "Bogazici University"
  },
]

// FAQ Data
const faqApplicationProcess = [
  {
    question: "What are the general requirements to study in Turkey?",
    answer:
      "International students typically need:<ul class='list-disc pl-5 mt-2 space-y-1'><li>A high school diploma or equivalent</li><li>Transcripts of previous education</li><li>Proof of language proficiency (Turkish or English)</li><li>Valid passport</li><li>Student visa</li><li>Health insurance</li></ul>Requirements may vary by university and program.",
  },
  {
    question: "How do I apply to Turkish universities through Agenta?",
    answer:
      "The process is simple:<ol class='list-decimal pl-5 mt-2 space-y-1'><li>Create an account on our platform</li><li>Complete your profile with academic information</li><li>Browse and select universities and programs</li><li>Upload required documents</li><li>Submit your applications</li><li>Track your application status through our dashboard</li></ol>Our advisors will guide you through each step.",
  },
  {
    question: "When should I start the application process?",
    answer:
      "We recommend starting at least 6-8 months before your intended start date. Fall semester (September) applications typically open in January and close in May/June. Spring semester (February) applications open in September and close in November/December. Some universities have rolling admissions, but starting early gives you more options and time for visa processing.",
  },
  {
    question: "Do I need to know Turkish to study in Turkey?",
    answer:
      "Not necessarily. Many universities offer programs taught entirely in English. However, if you choose a Turkish-taught program, you'll need to demonstrate Turkish proficiency or complete a preparatory year of Turkish language study. We can help you find programs that match your language preferences.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "Once you submit a complete application, universities typically respond within 4-6 weeks. The entire process from application to arrival can take 3-6 months, including visa processing. Working with Agenta can expedite this process as we have direct channels with university admissions offices.",
  },
]

const faqStudentLife = [
  {
    question: "What is student life like in Turkey?",
    answer:
      "Student life in Turkey is vibrant and diverse. Universities offer numerous clubs, sports teams, and cultural activities. Turkish cities blend modern amenities with rich historical heritage, providing a unique cultural experience. Students enjoy cafes, parks, museums, and festivals. The warm Turkish hospitality makes international students feel welcome, and you'll find communities of students from around the world.",
  },
  {
    question: "Is Turkey safe for international students?",
    answer:
      "Turkey is generally safe for international students. University campuses have security measures in place, and most student areas are well-monitored. Like any country, it's important to take normal safety precautions. Turkish people are known for their hospitality toward visitors. We provide safety guidelines during orientation, and universities have international offices to assist with any concerns.",
  },
  {
    question: "What accommodation options are available?",
    answer:
      "Students have several options:<ul class='list-disc pl-5 mt-2 space-y-1'><li>University dormitories (most affordable)</li><li>Private dormitories</li><li>Shared apartments</li><li>Private rentals</li></ul>Most universities guarantee housing for international students in their first year. We help students understand their options and can connect you with reliable housing resources.",
  },
  {
    question: "Can I work while studying in Turkey?",
    answer:
      "Yes, international students can work part-time (up to 24 hours per week) with a work permit after their first year of studies. During summer breaks, full-time work is permitted. Universities often help with the work permit process and may offer on-campus employment opportunities. We can provide guidance on balancing work and studies effectively.",
  },
  {
    question: "What healthcare options are available to international students?",
    answer:
      "All international students must have health insurance to study in Turkey. You can either:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Purchase the Turkish General Health Insurance (SGK)</li><li>Obtain private international student health insurance</li></ul>Most universities have on-campus health centers for basic care, and Turkish cities have excellent hospitals and medical facilities. We help students understand their insurance options during the application process.",
  },
]

const faqCostsScholarships = [
  {
    question: "What are the typical tuition fees at Turkish universities?",
    answer:
      "Tuition fees vary widely depending on the university, program, and language of instruction:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Public universities: $300-$1,500 per year</li><li>Private universities: $5,000-$20,000 per year</li></ul>Medical and engineering programs typically cost more than humanities and social sciences. English-taught programs often have higher fees than Turkish-taught programs.",
  },
  {
    question: "What scholarships are available for international students?",
    answer:
      "Several scholarship options exist:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Türkiye Scholarships (government scholarships covering tuition, accommodation, and stipend)</li><li>University-specific scholarships (merit-based, need-based, or country-specific)</li><li>External scholarships from your home country or international organizations</li></ul>Our scholarship matching tool can help identify opportunities you're eligible for, and our advisors assist with scholarship applications.",
  },
  {
    question: "What is the cost of living for students in Turkey?",
    answer:
      "Turkey offers an affordable cost of living compared to many Western countries. Monthly expenses typically range from $300-$600, depending on the city and lifestyle. This includes:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Accommodation: $100-$300</li><li>Food: $100-$150</li><li>Transportation: $20-$40</li><li>Utilities and internet: $50-$80</li><li>Books and supplies: $20-$50</li><li>Personal expenses: $50-$100</li></ul>Istanbul and Ankara have higher costs than smaller cities.",
  },
  {
    question: "Are there application fees for Turkish universities?",
    answer:
      "Many Turkish universities charge application fees ranging from $25-$100 per application. When you apply through Agenta, we can waive application fees for select partner universities, potentially saving you hundreds of dollars if you're applying to multiple institutions.",
  },
  {
    question: "How can I open a bank account as an international student?",
    answer:
      "Once you arrive in Turkey with your student residence permit, you can open a bank account at any Turkish bank. Required documents typically include your passport, student residence permit, and student ID. Some universities have bank branches on campus that specialize in serving international students. We provide guidance on banking options during orientation.",
  },
]

const faqOurServices = [
  {
    question: "Are Agenta's services free for students?",
    answer:
      "Many of our basic services are free, including university matching, program recommendations, and application guidance. We offer premium services for more comprehensive support, including document preparation, scholarship application assistance, visa guidance, and pre-departure orientation. Our transparent pricing is available on our website, and we offer packages tailored to different needs and budgets.",
  },
  {
    question: "How does Agenta select its partner universities?",
    answer:
      "We carefully evaluate universities based on:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Academic reputation and accreditation</li><li>Quality of international student support</li><li>Graduate employment outcomes</li><li>Student satisfaction ratings</li><li>Campus facilities and resources</li><li>Value for tuition investment</li></ul>We regularly review our partnerships to ensure they meet our quality standards and visit campuses personally to assess the student experience.",
  },
  {
    question: "What support does Agenta provide after I'm accepted?",
    answer:
      "Our support continues well beyond acceptance. We provide:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Visa application guidance</li><li>Pre-departure orientation</li><li>Airport pickup arrangements</li><li>Housing assistance</li><li>Cultural adaptation support</li><li>Ongoing academic advising</li></ul>We maintain contact throughout your studies to ensure your experience is positive and successful.",
  },
  {
    question: "Can Agenta help with visa applications?",
    answer:
      "Yes, we provide comprehensive visa guidance, including:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Document checklists specific to your country</li><li>Application review before submission</li><li>Preparation for visa interviews</li><li>Tracking of application status</li><li>Guidance if complications arise</li></ul>Our visa success rate is over 95% for students who follow our guidance.",
  },
  {
    question: "What makes Agenta different from other education consultancies?",
    answer:
      "Agenta stands out through:<ul class='list-disc pl-5 mt-2 space-y-1'><li>Exclusive focus on Turkish higher education</li><li>Direct partnerships with 45+ universities</li><li>Multilingual advisors with personal experience studying in Turkey</li><li>Transparent, unbiased information about universities</li><li>Continued support throughout your educational journey</li><li>Technology-driven platform with personalized matching</li><li>Strong alumni network for mentorship opportunities</li></ul>We measure our success by your success and satisfaction.",
  },
]
