"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, Clock, FileCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent, 
  EnhancedCardFooter 
} from "./enhanced-card"
import { Application, getUserApplications } from "../lib/api"

export function ApplicationsDashboard() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  // Get translation based on language
  const getText = (en: string, tr: string, ar: string) => {
    return language === "en" ? en : language === "tr" ? tr : ar
  }

  // Status translation
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return getText("Draft", "Taslak", "مسودة")
      case "in-progress":
        return getText("In Progress", "Devam Ediyor", "قيد التقدم")
      case "submitted":
        return getText("Submitted", "Gönderildi", "تم التقديم")
      case "accepted":
        return getText("Accepted", "Kabul Edildi", "مقبول")
      case "rejected":
        return getText("Rejected", "Reddedildi", "مرفوض")
      default:
        return status
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": 
        return "bg-gray-100 text-gray-800"
      case "in-progress": 
        return "bg-yellow-100 text-yellow-800"
      case "submitted": 
        return "bg-blue-100 text-blue-800"
      case "accepted": 
        return "bg-green-100 text-green-800"
      case "rejected": 
        return "bg-red-100 text-red-800"
      default: 
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get gradient for card
  const getCardGradient = (status: string) => {
    switch (status) {
      case "draft": 
        return "none"
      case "in-progress": 
        return "amber"
      case "submitted": 
        return "blue"
      case "accepted": 
        return "green"
      case "rejected": 
        return "rose"
      default: 
        return "none"
    }
  }

  // Format time remaining until deadline
  const formatTimeRemaining = (deadline: string) => {
    try {
      const deadlineDate = new Date(deadline)
      const now = new Date()
      
      if (deadlineDate < now) {
        return getText("Expired", "Süresi Doldu", "منتهي الصلاحية")
      }
      
      return formatDistanceToNow(deadlineDate, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting deadline:", error)
      return deadline
    }
  }

  // Calculate progress percentage
  const calculateProgress = (uploaded: number, required: number) => {
    if (required === 0) return 100
    return Math.min(Math.round((uploaded / required) * 100), 100)
  }

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getUserApplications()
        setApplications(data)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Sort applications by deadline (closest first)
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {getText("My Applications", "Başvurularım", "طلباتي")}
          </h2>
          <p className="text-muted-foreground">
            {getText(
              "Manage and track your university applications",
              "Üniversite başvurularınızı yönetin ve takip edin",
              "إدارة وتتبع طلبات الجامعة الخاصة بك"
            )}
          </p>
        </div>
        <Button className="w-full md:w-auto">
          {getText("New Application", "Yeni Başvuru", "طلب جديد")}
        </Button>
      </div>

      {loading ? (
        // Skeleton loading state
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <EnhancedCard key={i}>
              <EnhancedCardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </EnhancedCardContent>
              <EnhancedCardFooter className="border-t pt-4">
                <Skeleton className="h-9 w-full" />
              </EnhancedCardFooter>
            </EnhancedCard>
          ))}
        </div>
      ) : applications.length === 0 ? (
        // Empty state
        <EnhancedCard className="flex flex-col items-center justify-center p-8 text-center">
          <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {getText("No Applications Yet", "Henüz Başvuru Yok", "لا توجد طلبات حتى الآن")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {getText(
              "Start your university application journey by creating your first application.",
              "İlk başvurunuzu oluşturarak üniversite başvuru yolculuğunuza başlayın.",
              "ابدأ رحلة طلب الجامعة من خلال إنشاء طلبك الأول."
            )}
          </p>
          <Button>
            {getText("Create Application", "Başvuru Oluştur", "إنشاء طلب")}
          </Button>
        </EnhancedCard>
      ) : (
        // Applications grid
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {sortedApplications.map((app) => (
            <EnhancedCard 
              key={app.id} 
              id={app.id}
              hoverEffect
              gradient={getCardGradient(app.status) as "blue" | "purple" | "green" | "amber" | "rose" | "none"}
              className="overflow-hidden"
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle>{app.universityName}</EnhancedCardTitle>
                <EnhancedCardDescription>{app.programName}</EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {getText("Status", "Durum", "الحالة")}:
                    </span>
                    <Badge 
                      variant="outline"
                      className={`${getStatusColor(app.status)} border-0`}
                    >
                      {getStatusText(app.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getText("Deadline", "Son Tarih", "الموعد النهائي")}:
                    </span>
                    <span className="text-sm font-medium">
                      {formatTimeRemaining(app.deadline)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getText("Documents", "Belgeler", "المستندات")}
                      </span>
                      <span>
                        {app.documentsUploaded}/{app.documentsRequired}
                      </span>
                    </div>
                    <Progress 
                      value={calculateProgress(app.documentsUploaded, app.documentsRequired)} 
                      className="h-1.5" 
                    />
                  </div>
                </div>
              </EnhancedCardContent>
              <EnhancedCardFooter className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  asChild
                >
                  <Link href={`/student-dashboard/applications/${app.id}`}>
                    {getText("Manage Application", "Başvuruyu Yönet", "إدارة الطلب")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </EnhancedCardFooter>
            </EnhancedCard>
          ))}
        </div>
      )}

      {/* Alert for applications with upcoming deadlines */}
      {applications.some(app => 
        new Date(app.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
      ) && (
        <EnhancedCard gradient="amber" className="border border-amber-200">
          <EnhancedCardHeader className="flex flex-row gap-3 items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <EnhancedCardTitle>
              {getText(
                "Upcoming Deadlines",
                "Yaklaşan Son Tarihler",
                "المواعيد النهائية القادمة"
              )}
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <p>
              {getText(
                "You have applications with deadlines coming up in the next 7 days. Make sure to complete and submit them on time.",
                "Önümüzdeki 7 gün içinde son başvuru tarihi olan başvurularınız var. Onları zamanında tamamlayıp gönderdiğinizden emin olun.",
                "لديك طلبات بمواعيد نهائية قادمة في الأيام السبعة القادمة. تأكد من إكمالها وتقديمها في الوقت المحدد."
              )}
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
      )}
    </div>
  )
}
