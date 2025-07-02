"use client"

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Search, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { degreeTypes, getDepartmentsByDegreeType } from "@/data/education-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Department {
  id: string;
  name: {
    en: string;
    tr: string;
  };
}

interface DepartmentType {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  icon: React.ReactNode;
}

export function SelectionWizard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [degreeType, setDegreeType] = useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDepartments([]);
    setDepartmentSearchQuery("");
  }, [degreeType]);

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDepartmentToggle = (departmentId: string): void => {
    setSelectedDepartments((prev: string[]) =>
      prev.includes(departmentId)
        ? prev.filter((id: string) => id !== departmentId)
        : [...prev, departmentId]
    )
  }

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!degreeType && selectedDepartments.length > 0
      case 2:
        return !!name && !!email && /\S+@\S+\.\S+/.test(email)
      default:
        return true
    }
  }

  const getDepartments = (): Array<{id: string, name: {en: string, tr: string}}> => {
    if (!degreeType) return []
    const depts = getDepartmentsByDegreeType(degreeType)
    return depts.filter((dept: {name: {en: string, tr: string}}) =>
      (language === "en" ? dept.name.en : dept.name.tr)
        .toLowerCase()
        .includes(departmentSearchQuery.toLowerCase())
    )
  }

  const handleSubmit = useCallback(async () => {
    try {
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Redirect to login page with a return URL
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Get the token from the user object
      const token = user?.token;
      
      if (!token) {
        throw new Error(t('Authentication failed - please log in again') || 'Authentication failed');
      }

      setIsSubmitting(true);
      
      const response = await fetch('/api/submit-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name || user?.student?.name || user?.user?.name || '',
          email: email || user?.email || '',
          degreeType,
          selectedDepartments,
          userId: user?.id
        }),
      });

      if (!response.ok) {
        let errorMessage = t('Submission failed') || 'Submission failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : t('An unknown error occurred') || 'An unknown error occurred';
      setError(errorMessage);
      
      // If the error is related to authentication, clear the auth state and redirect to login
      if (error instanceof Error && (
        error.message.includes('Unauthorized') || 
        error.message.includes('Authentication failed')
      )) {
        await logout();
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, user, name, email, degreeType, selectedDepartments, router, t, logout]);

  const getSelectedDepartmentNames = (): string[] => {
    if (!degreeType) return [];
    const depts = getDepartmentsByDegreeType(degreeType);
    return depts
      .filter((dept: {id: string}) => selectedDepartments.includes(dept.id))
      .map((dept: {name: {en: string, tr: string}}) => 
        language === 'en' ? dept.name.en : dept.name.tr
      );
  };
  
  // Success screen with animations
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg">
          <CardContent className="p-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <Check className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold mb-4"
            >
              {t("Thank You!")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground"
            >
              {t("Your selections have been submitted successfully. We will be in touch with you shortly.")}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Main wizard interface with animations
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg border-primary/10">
        <CardContent className="p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4 relative">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div 
                    className={cn(
                      "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                      currentStep > index + 1 
                        ? "bg-primary border-primary text-white" 
                        : currentStep === index + 1 
                          ? "bg-white border-primary text-primary" 
                          : "bg-white border-gray-200 text-gray-400"
                    )}
                  >
                    {currentStep > index + 1 ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div 
                      className={cn(
                        "absolute top-5 h-[2px] transition-all duration-500",
                        "w-full transform -translate-x-1/2",
                        currentStep > index + 1 ? "bg-primary" : "bg-gray-200"
                      )}
                      style={{ left: `${((index + 1.5) / totalSteps) * 100}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={`step-title-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-center mt-4"
              >
                {currentStep === 1 && t("Select Your Field of Study")}
                {currentStep === 2 && t("Your Information")}
                {currentStep === 3 && t("Review and Submit")}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Step content with animations */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("1. Select Your Degree Type")}</h3>
                  <RadioGroup
                    value={degreeType}
                    onValueChange={setDegreeType}
                    className="flex justify-center gap-4 flex-wrap"
                  >
                    {degreeTypes.filter(type => type.id === "associate" || type.id === "bachelor").map((type) => (
                      <Label
                        key={type.id}
                        htmlFor={type.id}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200 hover:shadow-md",
                          degreeType === type.id 
                            ? "border-primary bg-primary/5" 
                            : "border-transparent bg-card"
                        )}
                      >
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <motion.span 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 15,
                            delay: type.id === degreeType ? 0 : 0.1 
                          }}
                          className="text-2xl mb-2"
                        >
                          {type.icon}
                        </motion.span>
                        <span className="font-bold text-center">
                          {language === "en" ? type.name.en : type.name.tr}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {degreeType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-lg mb-4">{t("2. Select Department(s)")}</h3>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={t("Search departments...")}
                        value={departmentSearchQuery}
                        onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                        className="pl-10 transition-all duration-300 border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                    <ScrollArea className="h-72 w-full rounded-md border p-4 border-primary/10">
                      <div className="space-y-2">
                        {getDepartments().map((department, index) => (
                          <motion.div 
                            key={department.id} 
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Checkbox
                              id={department.id}
                              checked={selectedDepartments.includes(department.id)}
                              onCheckedChange={() => handleDepartmentToggle(department.id)}
                              className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label htmlFor={department.id} className="text-sm font-medium leading-none cursor-pointer flex-1">
                              {language === "en" ? department.name.en : department.name.tr}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-md mx-auto"
              >
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label 
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    {t("Full Name")}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("John Doe")}
                    required
                    className="transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 border-primary/20"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label 
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    {t("Email Address")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("you@example.com")}
                    required
                    className="transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 border-primary/20"
                  />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-semibold text-lg">{t("Your Information")}</h3>
                  <p><span className="font-medium">{t("Name")}:</span> {name}</p>
                  <p><span className="font-medium">{t("Email")}:</span> {email}</p>
                </motion.div>
                <motion.div 
                  className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-lg">{t("Selected Field of Study")}</h3>
                  <p>
                    <span className="font-medium">{t("Degree Type")}:</span> 
                    {degreeType && (language === 'en' 
                      ? degreeTypes.find(d => d.id === degreeType)?.name.en 
                      : degreeTypes.find(d => d.id === degreeType)?.name.tr
                    )}
                  </p>
                  <div>
                    <p className="font-medium">{t("Departments")}:</p>
                    <ul className="list-disc list-inside mt-1">
                      {getSelectedDepartmentNames().map((deptName, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="pl-1"
                        >
                          {deptName}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-muted-foreground italic text-center"
                >
                  {t("By clicking submit, you agree to be contacted by our team.")}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons with animations */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex items-center gap-2 group hover:border-primary"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {t("Previous")}
                </Button>
              </motion.div>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  onClick={handleNext} 
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 group"
                >
                  {t("Next")}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !isStepValid()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">{t("Submitting...")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> {t("Submit")}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-red-500 italic text-center mt-4"
            >
              {error}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
