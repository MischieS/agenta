"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Download, HelpCircle, Settings, FileText, GraduationCap, LayoutDashboard } from "lucide-react"
import { DashboardOverview } from "./components/dashboard-overview"
import SettingsTab from "./settings-tab"

export default function StudentDashboardPage() {
  const { language } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect("/signin")
  }

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Main content area */}
      <div className="space-y-6">
        {/* Tab bar - secondary navbar */}
        <Tabs defaultValue="overview" className="w-full">
          {/* Sticky tab navigation with glass effect */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b pb-2">
            <TabsList className="grid grid-cols-6 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {language === "en" && "Student Dashboard Overview"}
                {language === "tr" && "Öğrenci Panosu Genel Bakış"}
                {language === "ar" && "نظرة عامة على لوحة الطالب"}
              </TabsTrigger>
              
              <TabsTrigger 
                value="applications" 
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400 rounded-md transition-all duration-200"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                {language === "en" && "Applications"}
                {language === "tr" && "Başvurular"}
                {language === "ar" && "التطبيقات"}
              </TabsTrigger>
              
              <Link href="/student-dashboard/documents" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md transition-all duration-200 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400">
                <FileText className="h-4 w-4 mr-2" />
                {language === "en" && "Documents"}
                {language === "tr" && "Belgeler"}
                {language === "ar" && "المستندات"}
              </Link>
              
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600 dark:data-[state=active]:bg-red-900/20 dark:data-[state=active]:text-red-400 rounded-md transition-all duration-200"
              >
                <Bell className="h-4 w-4 mr-2" />
                {language === "en" && "Notifications"}
                {language === "tr" && "Bildirimler"}
                {language === "ar" && "إشعارات"}
              </TabsTrigger>
              
              <TabsTrigger 
                value="support" 
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400 rounded-md transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {language === "en" && "Support"}
                {language === "tr" && "Destek"}
                {language === "ar" && "الدعم"}
              </TabsTrigger>
              
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-400 rounded-md transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                {language === "en" && "Settings"}
                {language === "tr" && "Ayarlar"}
                {language === "ar" && "إعدادات"}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab content areas */}
          <TabsContent value="overview" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  {language === "en" && "Your Applications"}
                  {language === "tr" && "Başvurularınız"}
                  {language === "ar" && "طلباتك"}
                </CardTitle>
                <CardDescription>
                  {language === "en" && "Manage and track your submitted applications"}
                  {language === "tr" && "Gönderilen başvurularınızı yönetin ve takip edin"}
                  {language === "ar" && "إدارة وتتبع طلباتك المقدمة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === "en" && "Your recent applications will be shown here."}
                    {language === "tr" && "Son başvurularınız burada gösterilecektir."}
                    {language === "ar" && "سيتم عرض طلباتك الأخيرة هنا."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-8">
              {/* Header with title and upload button */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {language === "en" && "My Documents"}
                    {language === "tr" && "Belgelerim"}
                    {language === "ar" && "مستنداتي"}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === "en" && "Manage and track your required documents"}
                    {language === "tr" && "Gerekli belgelerinizi yönetin ve takip edin"}
                    {language === "ar" && "إدارة وتتبع المستندات المطلوبة"}
                  </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  {language === "en" && "Upload Document"}
                  {language === "tr" && "Belge Yükle"}
                  {language === "ar" && "تحميل المستند"}
                </button>
              </div>
              
              {/* Stats cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
                <div className="rounded-lg bg-card text-card-foreground border border-border/40 shadow-lg shadow-black/5 transition-all backdrop-blur-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <div className="tracking-tight font-semibold text-sm">
                      {language === "en" && "Total Documents"}
                      {language === "tr" && "Toplam Belge"}
                      {language === "ar" && "إجمالي المستندات"}
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">7</div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-card text-card-foreground border border-border/40 shadow-lg shadow-black/5 transition-all backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <div className="tracking-tight font-semibold text-sm">
                      {language === "en" && "Approved"}
                      {language === "tr" && "Onaylı"}
                      {language === "ar" && "معتمدة"}
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">5</div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-card text-card-foreground border border-border/40 shadow-lg shadow-black/5 transition-all backdrop-blur-sm bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10">
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <div className="tracking-tight font-semibold text-sm">
                      {language === "en" && "Pending"}
                      {language === "tr" && "Beklemede"}
                      {language === "ar" && "قيد الانتظار"}
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">2</div>
                  </div>
                </div>
              </div>
              
              {/* Documents list */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" && "Document List"}
                    {language === "tr" && "Belge Listesi"}
                    {language === "ar" && "قائمة المستندات"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">application-form.pdf</p>
                          <p className="text-sm text-muted-foreground">PDF • 2.4MB</p>
                        </div>
                      </div>
                      <button className="flex items-center text-sm text-blue-500 hover:text-blue-600 gap-1">
                        <Download className="h-4 w-4" />
                        {language === "en" && "Download"}
                        {language === "tr" && "İndir"}
                        {language === "ar" && "تحميل"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">transcript.pdf</p>
                          <p className="text-sm text-muted-foreground">PDF • 1.7MB</p>
                        </div>
                      </div>
                      <button className="flex items-center text-sm text-blue-500 hover:text-blue-600 gap-1">
                        <Download className="h-4 w-4" />
                        {language === "en" && "Download"}
                        {language === "tr" && "İndir"}
                        {language === "ar" && "تحميل"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  {language === "en" && "Notifications"}
                  {language === "tr" && "Bildirimler"}
                  {language === "ar" && "إشعارات"}
                </CardTitle>
                <CardDescription>
                  {language === "en" && "Stay updated with important notifications"}
                  {language === "tr" && "Önemli bildirimlerle güncel kalın"}
                  {language === "ar" && "ابق على اطلاع بالإشعارات المهمة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        {language === "en" && "Application Status Update"}
                        {language === "tr" && "Başvuru Durumu Güncellemesi"}
                        {language === "ar" && "تحديث حالة الطلب"}
                      </p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                    <p className="text-sm mt-2">
                      {language === "en" && "Your application has been reviewed and is now in the next stage."}
                      {language === "tr" && "Başvurunuz incelendi ve şimdi bir sonraki aşamada."}
                      {language === "ar" && "تمت مراجعة طلبك وهو الآن في المرحلة التالية."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" />
                  {language === "en" && "Support Center"}
                  {language === "tr" && "Destek Merkezi"}
                  {language === "ar" && "مركز الدعم"}
                </CardTitle>
                <CardDescription>
                  {language === "en" && "Get help with your account and applications"}
                  {language === "tr" && "Hesabınız ve başvurularınız hakkında yardım alın"}
                  {language === "ar" && "احصل على مساعدة بشأن حسابك وتطبيقاتك"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === "en" && "Have questions or need assistance? Our support team is here to help."}
                    {language === "tr" && "Sorularınız mı var veya yardıma mı ihtiyacınız var? Destek ekibimiz yardıma hazır."}
                    {language === "ar" && "هل لديك أسئلة أو تحتاج إلى مساعدة؟ فريق الدعم لدينا هنا للمساعدة."}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {language === "en" && "FAQ"}
                          {language === "tr" && "SSS"}
                          {language === "ar" && "الأسئلة الشائعة"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" && "Find answers to commonly asked questions."}
                          {language === "tr" && "Sık sorulan soruların cevaplarını bulun."}
                          {language === "ar" && "ابحث عن إجابات للأسئلة الشائعة."}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {language === "en" && "Contact Us"}
                          {language === "tr" && "Bize Ulaşın"}
                          {language === "ar" && "اتصل بنا"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" && "Reach out to our support team directly."}
                          {language === "tr" && "Doğrudan destek ekibimize ulaşın."}
                          {language === "ar" && "تواصل مع فريق الدعم لدينا مباشرة."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
