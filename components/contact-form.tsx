"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Check, X, Send } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  })

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Form validation
  const errors = {
    name: !formData.name.trim() ? 'Name is required' : '',
    email: !formData.email.trim() 
      ? 'Email is required' 
      : !validateEmail(formData.email) 
        ? 'Please enter a valid email' 
        : '',
    message: !formData.message.trim() ? 'Message is required' : ''
  }

  const isFormValid = !Object.values(errors).some(error => error)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setTouched({ name: true, email: true, message: true })
    if (!isFormValid) return

    setIsSubmitting(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setFormData({ name: "", email: "", message: "" })
      setTouched({ name: false, email: false, message: false })
    } catch (err) {
      setError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return (
    <>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-700">Message sent successfully!</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-3"
          >
            <X className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            placeholder="Name"
            className={touched.name && errors.name ? 'border-red-500' : ''}
          />
          {touched.name && errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder="Email"
            className={touched.email && errors.email ? 'border-red-500' : ''}
          />
          {touched.email && errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Message</label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur('message')}
            placeholder="Your message..."
            rows={4}
            className={touched.message && errors.message ? 'border-red-500' : ''}
          />
          {touched.message && errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || !isFormValid}
          className="w-full"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="ml-2">Send Message</span>
        </Button>
      </form>
    </>
  )
}