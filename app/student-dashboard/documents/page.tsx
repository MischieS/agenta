"use client"

import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import { Bell, Download, HelpCircle, Settings, FileText, GraduationCap, LayoutDashboard } from "lucide-react"
import { DocumentsDashboard } from "../components/documents-dashboard"

export default function DocumentsPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  
  // Redirect if not authenticated
  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Navigation Tabs */}
      <div className="sticky top-16 z-30 w-full bg-background/80 backdrop-blur-sm">
        <div className="pb-3 mb-4 border-b">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto py-1">
              {/* Overview Tab */}
              <Link href="/student-dashboard" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {language === "en" && "Overview"}
                {language === "tr" && "Genel Bakış"}
                {language === "ar" && "نظرة عامة"}
              </Link>
              
              {/* Applications Tab */}
              <Link href="/student-dashboard?tab=applications" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400">
                <GraduationCap className="h-4 w-4 mr-2" />
                {language === "en" && "Applications"}
                {language === "tr" && "Başvurular"}
                {language === "ar" && "التطبيقات"}
              </Link>
              
              {/* Documents Tab - Active */}
              <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded-md transition-all duration-200">
                <FileText className="h-4 w-4 mr-2" />
                {language === "en" && "Documents"}
                {language === "tr" && "Belgeler"}
                {language === "ar" && "المستندات"}
              </div>
              
              {/* Notifications Tab */}
              <Link href="/student-dashboard?tab=notifications" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                <Bell className="h-4 w-4 mr-2" />
                {language === "en" && "Notifications"}
                {language === "tr" && "Bildirimler"}
                {language === "ar" && "الإشعارات"}
              </Link>
              
              {/* Support Tab */}
              <Link href="/student-dashboard?tab=support" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20 dark:hover:text-teal-400">
                <HelpCircle className="h-4 w-4 mr-2" />
                {language === "en" && "Support"}
                {language === "tr" && "Destek"}
                {language === "ar" && "الدعم"}
              </Link>
              
              {/* Settings Tab */}
              <Link href="/student-dashboard?tab=settings" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800/20 dark:hover:text-gray-400">
                <Settings className="h-4 w-4 mr-2" />
                {language === "en" && "Settings"}
                {language === "tr" && "Ayarlar"}
                {language === "ar" && "الإعدادات"}
              </Link>
            </TabsList>
            
            {/* Content */}
            <TabsContent value="documents" className="focus-visible:outline-none focus-visible:ring-0">
              <DocumentsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
