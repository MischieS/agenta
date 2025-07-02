"use client"
import { motion } from "framer-motion"
import { 
  PageTransition, 
  FadeIn, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/animated"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"

// A new component for animated icons
const AnimatedIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div whileHover={{ y: -2, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
    {children}
  </motion.div>
);

// A new component for the modern animated card
const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
      variants={{
        hover: {
          scale: 1.5,
          opacity: 0.8,
        }
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.4
      }}
    />
    <div className="relative z-10 h-full w-full rounded-2xl bg-white dark:bg-gray-900 p-6">
      {children}
    </div>
  </motion.div>
);


const ContactInfo = () => (
  <StaggerContainer className="space-y-8">
    <StaggerItem>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Information</h2>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">You can reach us through the following channels.</p>
    </StaggerItem>
    
    <StaggerItem>
      <AnimatedCard>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <AnimatedIcon><Mail className="h-6 w-6 text-primary" /></AnimatedIcon>
            <a href="mailto:hello@example.com" className="text-base text-gray-700 dark:text-gray-200 hover:underline">hello@example.com</a>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedIcon><Phone className="h-6 w-6 text-primary" /></AnimatedIcon>
            <a href="tel:+15552345678" className="text-base text-gray-700 dark:text-gray-200 hover:underline">+1 (555) 234-5678</a>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedIcon><MapPin className="h-6 w-6 text-primary" /></AnimatedIcon>
            <span className="text-base text-gray-700 dark:text-gray-200">123 Innovation Street, Tech City</span>
          </div>
        </div>
      </AnimatedCard>
    </StaggerItem>

    <StaggerItem>
       <AnimatedCard>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Follow Us</h3>
          <div className="flex justify-around">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><AnimatedIcon><Facebook className="h-7 w-7" /></AnimatedIcon></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><AnimatedIcon><Twitter className="h-7 w-7" /></AnimatedIcon></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><AnimatedIcon><Instagram className="h-7 w-7" /></AnimatedIcon></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><AnimatedIcon><Linkedin className="h-7 w-7" /></AnimatedIcon></a>
          </div>
       </AnimatedCard>
    </StaggerItem>
  </StaggerContainer>
);

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <FadeIn>
          <div className="relative bg-gradient-to-b from-primary-600/10 to-transparent py-24 sm:py-32">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
              >
                Get in Touch
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
              >
                We'd love to hear from you. Fill out the form below or use our contact details.
              </motion.p>
            </div>
          </div>
        </FadeIn>

        <div className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <ContactInfo />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              >
                <AnimatedCard>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl">Send a Message</CardTitle>
                      <CardDescription>We'll get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <ContactForm />
                </AnimatedCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}