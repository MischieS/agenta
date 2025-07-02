"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLanguage } from "@/contexts/language-context"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Define our Zod schema for form validation
const formSchema = z.object({
  userType: z.enum(["user", "student"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const { language, t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "user",
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null)
    
    try {
      const isStudent = values.userType === "student"
      
      const { error } = await signup(
        values.email, 
        values.password, 
        values.name, 
        values.surname,
        isStudent
      )
      
      if (error) {
        console.error("Signup error:", error)
        setError(error.message || "An error occurred during signup")
        return
      }
      
      router.push("/signin")
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    }
  }

  // Translations with fallbacks
  const translations = {
    title: t("signup.title") || "Create an Account",
    subtitle: t("signup.subtitle") || "Enter your details to create a new account",
    userTypeLabel: t("signup.userTypeLabel") || "Account Type",
    regularUserOption: t("signup.regularUserOption") || "Regular User",
    studentOption: t("signup.studentOption") || "Student",
    nameLabel: t("signup.nameLabel") || "First Name",
    namePlaceholder: t("signup.namePlaceholder") || "Enter your first name",
    surnameLabel: t("signup.surnameLabel") || "Last Name",
    surnamePlaceholder: t("signup.surnamePlaceholder") || "Enter your last name",
    emailLabel: t("signup.emailLabel") || "Email",
    emailPlaceholder: t("signup.emailPlaceholder") || "Enter your email address",
    passwordLabel: t("signup.passwordLabel") || "Password",
    passwordPlaceholder: t("signup.passwordPlaceholder") || "Create a password",
    confirmPasswordLabel: t("signup.confirmPasswordLabel") || "Confirm Password",
    confirmPasswordPlaceholder: t("signup.confirmPasswordPlaceholder") || "Confirm your password",
    processingButton: t("signup.processingButton") || "Creating account...",
    submitButton: t("signup.submitButton") || "Create Account",
    alreadyHaveAccount: t("signup.alreadyHaveAccount") || "Already have an account?",
    signInLink: t("signup.signInLink") || "Sign In"
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{translations.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {translations.subtitle}
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{translations.userTypeLabel}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {translations.regularUserOption}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {translations.studentOption}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations.namePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.surnameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations.surnamePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.emailLabel}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={translations.emailPlaceholder} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.passwordLabel}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={translations.passwordPlaceholder} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.confirmPasswordLabel}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={translations.confirmPasswordPlaceholder} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  {translations.processingButton}
                </div>
              ) : (
                translations.submitButton
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            {translations.alreadyHaveAccount}{" "}
            <Link href="/signin" className="text-blue-600 hover:underline dark:text-blue-400">
              {translations.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
