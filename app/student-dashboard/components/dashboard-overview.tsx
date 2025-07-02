"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Download, 
  Users, 
  FileText,
  GraduationCap,
  Calendar,
  Bell,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent, 
  EnhancedCardFooter 
} from "./enhanced-card"
import { getUserApplications, getUserDocuments, Application, Document } from "../lib/api"

export function DashboardOverview() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsData, docsData] = await Promise.all([
          getUserApplications(),
          getUserDocuments()
        ]);
        setApplications(appsData);
        setDocuments(docsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return language === "en" ? "Good morning" : language === "tr" ? "Günaydın" : "صباح الخير"
    if (hour < 18) return language === "en" ? "Good afternoon" : language === "tr" ? "İyi günler" : "مساء الخير"
    return language === "en" ? "Good evening" : language === "tr" ? "İyi akşamlar" : "مساء الخير"
  }

  const activeApplicationsCount = applications.filter(app => 
    app.status === 'in-progress' || app.status === 'draft'
  ).length;

  const totalDocumentsRequired = applications.reduce((sum, app) => sum + app.documentsRequired, 0);
  const totalDocumentsUploaded = applications.reduce((sum, app) => sum + app.documentsUploaded, 0);

  const nearestDeadline = applications.length > 0 
    ? applications.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]
    : null;

  const upcomingDeadlines = applications
    .filter(app => new Date(app.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0] || "Student"}!
        </h2>
        <p className="text-gray-500">
          {language === "en" && "Welcome to your student dashboard. Here you can track your application progress and manage your profile."}
          {language === "tr" && "Öğrenci kontrol panelinize hoş geldiniz. Burada başvuru sürecinizi takip edebilir ve profilinizi yönetebilirsiniz."}
          {language === "ar" && "مرحبًا بك في لوحة تحكم الطالب الخاصة بك. يمكنك هنا تتبع تقدم طلبك وإدارة ملفك الشخصي."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <EnhancedCard gradient="blue" className="overflow-hidden">
          <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <EnhancedCardTitle className="text-sm font-medium">
              {language === "en" && "Active Applications"}
              {language === "tr" && "Aktif Başvurular"}
              {language === "ar" && "التطبيقات النشطة"}
            </EnhancedCardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{activeApplicationsCount}</div>
            <p className="text-xs text-muted-foreground">
              {language === "en" && "+1 since last month"}
              {language === "tr" && "Geçen aya göre +1"}
              {language === "ar" && "+1 منذ الشهر الماضي"}
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
        <EnhancedCard gradient="purple" className="overflow-hidden">
          <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <EnhancedCardTitle className="text-sm font-medium">
              {language === "en" && "Documents Uploaded"}
              {language === "tr" && "Yüklenen Belgeler"}
              {language === "ar" && "المستندات التي تم تحميلها"}
            </EnhancedCardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{totalDocumentsUploaded}/{totalDocumentsRequired}</div>
            <p className="text-xs text-muted-foreground">
              {language === "en" && `${totalDocumentsRequired - totalDocumentsUploaded} documents remaining`}
              {language === "tr" && `${totalDocumentsRequired - totalDocumentsUploaded} belge kaldı`}
              {language === "ar" && `${totalDocumentsRequired - totalDocumentsUploaded} وثائق متبقية`}
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
        <EnhancedCard gradient="green" className="overflow-hidden">
          <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <EnhancedCardTitle className="text-sm font-medium">
              {language === "en" && "University Selections"}
              {language === "tr" && "Üniversite Seçimleri"}
              {language === "ar" && "اختيارات الجامعة"}
            </EnhancedCardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              {language === "en" && "+2 since last month"}
              {language === "tr" && "Geçen aya göre +2"}
              {language === "ar" && "+2 منذ الشهر الماضي"}
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
        <EnhancedCard gradient="amber" className="overflow-hidden">
          <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <EnhancedCardTitle className="text-sm font-medium">
              {language === "en" && "Upcoming Deadlines"}
              {language === "tr" && "Yaklaşan Son Tarihler"}
              {language === "ar" && "المواعيد النهائية القادمة"}
            </EnhancedCardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines.length}</div>
            {nearestDeadline && (
              <p className="text-xs text-muted-foreground">
                {language === "en" && `Next: ${new Date(nearestDeadline.deadline).toLocaleDateString()}`}
                {language === "tr" && `Sonraki: ${new Date(nearestDeadline.deadline).toLocaleDateString()}`}
                {language === "ar" && `التالي: ${new Date(nearestDeadline.deadline).toLocaleDateString()}`}
              </p>
            )}
          </EnhancedCardContent>
        </EnhancedCard>
      </div>

      {/* Recent Applications */}
      <EnhancedCard gradient="none" className="overflow-hidden">
        <EnhancedCardHeader>
          <EnhancedCardTitle>
            {language === "en" && "Recent Applications"}
            {language === "tr" && "Son Başvurular"}
            {language === "ar" && "التطبيقات الأخيرة"}
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {applications.slice(0, 3).map(app => (
                <EnhancedCard key={app.id} hoverEffect gradient={app.status === 'submitted' ? 'green' : app.status === 'in-progress' ? 'amber' : 'none'}>
                  <EnhancedCardHeader className="pb-2">
                    <EnhancedCardTitle>{app.universityName}</EnhancedCardTitle>
                    <EnhancedCardDescription className="flex items-center mt-1">
                      <GraduationCap className="mr-1 h-4 w-4" />
                      {app.programName}
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent className="pb-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'submitted' ? 'bg-green-100 text-green-800' : 
                        app.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status === 'submitted' ? 
                          (language === "en" ? "Submitted" : language === "tr" ? "Gönderildi" : "تم التقديم") : 
                          app.status === 'in-progress' ? 
                          (language === "en" ? "In Progress" : language === "tr" ? "Devam Ediyor" : "قيد التقدم") : 
                          (language === "en" ? "Draft" : language === "tr" ? "Taslak" : "مسودة")
                        }
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{new Date(app.deadline).toLocaleDateString()}</span>
                    </div>
                  </EnhancedCardContent>
                  <EnhancedCardFooter className="pt-2 border-t">
                    <Link href={`/student-dashboard/applications#${app.id}`} className="text-sm text-primary flex items-center hover:underline">
                      {language === "en" && "View Details"}
                      {language === "tr" && "Detayları Görüntüle"}
                      {language === "ar" && "عرض التفاصيل"}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </EnhancedCardFooter>
                </EnhancedCard>
              ))}
            </div>
            {applications.length > 3 && (
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/student-dashboard/applications">
                    {language === "en" && "View All Applications"}
                    {language === "tr" && "Tüm Başvuruları Görüntüle"}
                    {language === "ar" && "عرض جميع التطبيقات"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Recent Documents */}
      <EnhancedCard gradient="none" className="overflow-hidden">
        <EnhancedCardHeader>
          <EnhancedCardTitle>
            {language === "en" && "Recent Documents"}
            {language === "tr" && "Son Belgeler"}
            {language === "ar" && "المستندات الأخيرة"}
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {documents.slice(0, 3).map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' : 
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.status === 'verified' ? 
                        (language === "en" ? "Verified" : language === "tr" ? "Doğrulandı" : "تم التحقق") : 
                        doc.status === 'pending' ? 
                        (language === "en" ? "Pending" : language === "tr" ? "Beklemede" : "قيد الانتظار") : 
                        (language === "en" ? "Rejected" : language === "tr" ? "Reddedildi" : "مرفوض")
                      }
                    </span>
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {documents.length > 3 && (
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/student-dashboard/documents">
                    {language === "en" && "View All Documents"}
                    {language === "tr" && "Tüm Belgeleri Görüntüle"}
                    {language === "ar" && "عرض جميع المستندات"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  )
}
