"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Bell, Download, HelpCircle, Settings, FileText, GraduationCap, LayoutDashboard, Save, Upload } from "lucide-react"
import { DashboardOverview } from "./components/dashboard-overview"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function DashboardPage() {
  const { language, t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    redirect("/signin")
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return language === "en" ? "Good morning" : language === "tr" ? "Günaydın" : "صباح الخير"
    if (hour < 18) return language === "en" ? "Good afternoon" : language === "tr" ? "İyi günler" : "مساء الخير"
    return language === "en" ? "Good evening" : language === "tr" ? "İyi akşamlar" : "مساء الخير"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0] || "Student"}!
        </h2>
        <p className="text-gray-500">
          {language === "en" && "Welcome to your student dashboard. Here you can track your application progress and manage your profile."}
          {language === "tr" && "Öğrenci kontrol panelinize hoş geldiniz. Burada başvuru sürecinizi takip edebilir ve profilinizi yönetebilirsiniz."}
          {language === "ar" && "مرحبًا بك في لوحة تحكم الطالب الخاصة بك. يمكنك هنا تتبع تقدم طلبك وإدارة ملفك الشخصي."}
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 rounded-lg shadow-lg p-4">
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm w-full flex gap-1 overflow-x-auto p-1.5 transition-all duration-300 ease-in-out">
          <style jsx global>{`
            /* Smooth transition for tab selection */
            [role=tab] {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative;
              overflow: hidden;
            }
            
            /* Add hover effect */
            [role=tab]:hover:not([data-state=active]) {
              background-color: rgba(200, 200, 200, 0.2);
              transform: translateY(-1px);
            }
            
            /* Active tab indicator */
            [role=tab][data-state=active]::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              width: 20%;
              height: 2px;
              background-color: currentColor;
              transform: translateX(-50%);
              transition: width 0.3s ease;
            }
            
            
            /* Active tab hover - expand indicator */
            [role=tab][data-state=active]:hover::after {
              width: 60%;
            }
            
            /* Tab content transition */
            [role=tabpanel] {
              animation: fadeIn 0.5s ease-out;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">
              <span className="p-1 rounded-full bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400 mr-1">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              {language === "en" && "Overview"}
              {language === "tr" && "Genel Bakış"}
              {language === "ar" && "نظرة عامة"}
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400">
              <span className="p-1 rounded-full bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400 mr-1">
                <GraduationCap className="h-4 w-4" />
              </span>
              {language === "en" && "Applications"}
              {language === "tr" && "Başvurularım"}
              {language === "ar" && "تطبيقات"}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-600 dark:data-[state=active]:bg-yellow-900/20 dark:data-[state=active]:text-yellow-400">
              <span className="p-1 rounded-full bg-yellow-100 dark:bg-yellow-800/30 text-yellow-600 dark:text-yellow-400 mr-1">
                <FileText className="h-4 w-4" />
              </span>
              {language === "en" && "Documents"}
              {language === "tr" && "Belgelerim"}
              {language === "ar" && "وثائق"}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-red-50 data-[state=active]:text-red-600 dark:data-[state=active]:bg-red-900/20 dark:data-[state=active]:text-red-400">
              <span className="p-1 rounded-full bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 mr-1 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
              </span>
              {language === "en" && "Notifications"}
              {language === "tr" && "Bildirimler"}
              {language === "ar" && "الإشعارات"}
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400">
              <span className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400 mr-1">
                <HelpCircle className="h-4 w-4" />
              </span>
              {language === "en" && "Support"}
              {language === "tr" && "Destek"}
              {language === "ar" && "الدعم"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-400">
              <span className="p-1 rounded-full bg-purple-100 dark:bg-purple-800/30 text-purple-600 dark:text-purple-400 mr-1">
                <Settings className="h-4 w-4" />
              </span>
              {language === "en" && "Settings"}
              {language === "tr" && "Ayarlar"}
              {language === "ar" && "إعدادات"}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    {language === "en" && "Your Applications"}
                    {language === "tr" && "Başvurularınız"}
                    {language === "ar" && "طلباتك"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" && "Manage your university applications"}
                    {language === "tr" && "Üniversite başvurularınızı yönetin"}
                    {language === "ar" && "إدارة طلبات الجامعة الخاصة بك"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div>
                        <h3 className="font-medium">{language === "en" ? "Active Applications" : language === "tr" ? "Aktif Başvurular" : "الطلبات النشطة"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" && "You currently have 2 active applications."}
                          {language === "tr" && "Şu anda 2 aktif başvurunuz var."}
                          {language === "ar" && "لديك حاليًا 2 طلبات نشطة."}
                        </p>
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        {language === "en" ? "View All" : language === "tr" ? "Tümünü Gör" : "عرض الكل"}
                      </Button>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border rounded-lg divide-y">
                      <div className="p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div>
                          <h4 className="font-medium">{language === "en" ? "Istanbul University" : language === "tr" ? "İstanbul Üniversitesi" : "جامعة اسطنبول"}</h4>
                          <p className="text-sm text-muted-foreground">{language === "en" ? "Computer Engineering" : language === "tr" ? "Bilgisayar Mühendisliği" : "هندسة الحاسوب"}</p>
                          <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium rounded-full bg-amber-100 text-amber-800">{language === "en" ? "In Review" : language === "tr" ? "İncelemede" : "قيد المراجعة"}</span>
                        </div>
                        <Button variant="ghost" size="sm">{language === "en" ? "Details" : language === "tr" ? "Detaylar" : "تفاصيل"}</Button>
                      </div>
                      <div className="p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div>
                          <h4 className="font-medium">{language === "en" ? "Ankara University" : language === "tr" ? "Ankara Üniversitesi" : "جامعة أنقرة"}</h4>
                          <p className="text-sm text-muted-foreground">{language === "en" ? "Computer Science" : language === "tr" ? "Bilgisayar Bilimi" : "علوم الحاسوب"}</p>
                          <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium rounded-full bg-green-100 text-green-800">{language === "en" ? "Accepted" : language === "tr" ? "Kabul Edildi" : "تم قبوله"}</span>
                        </div>
                        <Button variant="ghost" size="sm">{language === "en" ? "Details" : language === "tr" ? "Detaylar" : "تفاصيل"}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    {language === "en" && "Your Documents"}
                    {language === "tr" && "Belgeleriniz"}
                    {language === "ar" && "وثائقك"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" && "Upload and manage your application documents"}
                    {language === "tr" && "Başvuru belgelerinizi yükleyin ve yönetin"}
                    {language === "ar" && "تحميل وإدارة مستندات طلبك"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div>
                        <h3 className="font-medium">{language === "en" ? "Document Status" : language === "tr" ? "Belge Durumu" : "حالة المستند"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" && "You have uploaded 7 out of 10 required documents."}
                          {language === "tr" && "10 gerekli belgeden 7 tanesini yüklediniz."}
                          {language === "ar" && "لقد قمت بتحميل 7 من أصل 10 مستندات مطلوبة."}
                        </p>
                      </div>
                      <div className="w-16 h-16 relative">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                          <span className="text-lg font-bold text-green-700 dark:text-green-300">70%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border rounded-lg divide-y">
                      <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{language === "en" ? "Transcript" : language === "tr" ? "Transkript" : "نسخة طبق الأصل"}</h4>
                            <p className="text-xs text-muted-foreground">PDF, 2.3 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{language === "en" ? "View" : language === "tr" ? "Görüntüle" : "عرض"}</Button>
                      </div>
                      
                      <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{language === "en" ? "Passport" : language === "tr" ? "Pasaport" : "جواز السفر"}</h4>
                            <p className="text-xs text-muted-foreground">PDF, 1.8 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{language === "en" ? "View" : language === "tr" ? "Görüntüle" : "عرض"}</Button>
                      </div>
                      
                      <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{language === "en" ? "Reference Letter" : language === "tr" ? "Referans Mektubu" : "خطاب مرجعي"}</h4>
                            <p className="text-xs text-amber-500">{language === "en" ? "Pending approval" : language === "tr" ? "Onay bekliyor" : "بانتظار الموافقة"}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{language === "en" ? "View" : language === "tr" ? "Görüntüle" : "عرض"}</Button>
                      </div>
                    </div>
                    
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between border-t pt-4">
      <Button variant="outline">{language === "en" ? "Cancel" : language === "tr" ? "İptal" : "إلغاء"}</Button>
      <Button className="bg-purple-600 hover:bg-purple-700">
        <Save className="h-4 w-4 mr-2" />
        {language === "en" ? "Save Changes" : language === "tr" ? "Değişiklikleri Kaydet" : "حفظ التغييرات"}
      </Button>
    </CardFooter>
  </Card>
</TabsContent>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                      <h3 className="font-medium mb-4 pb-2 border-b">
                        {language === "en" ? "Preferences" : language === "tr" ? "Tercihler" : "التفضيلات"}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{language === "en" ? "Language" : language === "tr" ? "Dil" : "اللغة"}</p>
                            <p className="text-sm text-muted-foreground">{language === "en" ? "Select your preferred language" : language === "tr" ? "Tercih ettiğiniz dili seçin" : "حدد لغتك المفضلة"}</p>
                          </div>
                          <select className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option value="en">English</option>
                            <option value="tr">Türkçe</option>
                            <option value="ar">العربية</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="font-medium">{language === "en" ? "Email Notifications" : language === "tr" ? "E-posta Bildirimleri" : "إشعارات البريد الإلكتروني"}</p>
                            <p className="text-sm text-muted-foreground">{language === "en" ? "Receive updates about your applications" : language === "tr" ? "Başvurularınızla ilgili güncellemeleri alın" : "تلقي تحديثات حول طلباتك"}</p>
                          </div>
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full px-1 flex items-center cursor-pointer">
                            <div className="bg-purple-500 w-4 h-4 rounded-full ml-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                        {language === "en" ? "Save Changes" : language === "tr" ? "Değişiklikleri Kaydet" : "حفظ التغييرات"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    {language === "en" && "Notifications"}
                    {language === "tr" && "Bildirimler"}
                    {language === "ar" && "الإشعارات"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" && "Stay updated with important alerts and information"}
                    {language === "tr" && "Önemli uyarılar ve bilgilerle güncel kalın"}
                    {language === "ar" && "ابق على اطلاع بالتنبيهات والمعلومات المهمة"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div>
                        <h3 className="font-medium">{language === "en" ? "Unread Notifications" : language === "tr" ? "Okunmamış Bildirimler" : "الإشعارات غير المقروءة"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" && "You have 3 unread notifications"}
                          {language === "tr" && "3 okunmamış bildiriminiz var"}
                          {language === "ar" && "لديك 3 إشعارات غير مقروءة"}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === "en" ? "Mark All as Read" : language === "tr" ? "Tümünü Okundu İşaretle" : "وضع علامة قراءة للكل"}
                      </Button>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border rounded-lg divide-y">
                      <div className="p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{language === "en" ? "Application Update" : language === "tr" ? "Başvuru Güncellemesi" : "تحديث الطلب"}</h4>
                            <span className="text-xs text-gray-500">1 hour ago</span>
                          </div>
                          <p className="text-sm">
                            {language === "en" ? "Your application to Ankara University has been accepted" : 
                            language === "tr" ? "Ankara Üniversitesi başvurunuz kabul edildi" : 
                            "تم قبول طلبك في جامعة أنقرة"}
                          </p>
                          <Button variant="link" className="text-blue-500 p-0 h-auto">
                            {language === "en" ? "View details" : language === "tr" ? "Detayları görüntüle" : "عرض التفاصيل"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{language === "en" ? "Document Verified" : language === "tr" ? "Belge Doğrulandı" : "تم التحقق من المستند"}</h4>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-sm">
                            {language === "en" ? "Your transcript has been verified and approved" : 
                            language === "tr" ? "Transkriptiniz doğrulandı ve onaylandı" : 
                            "تم التحقق من نسختك الأصلية والموافقة عليها"}
                          </p>
                          <Button variant="link" className="text-green-500 p-0 h-auto">
                            {language === "en" ? "View document" : language === "tr" ? "Belgeyi görüntüle" : "عرض المستند"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                          <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{language === "en" ? "Deadline Reminder" : language === "tr" ? "Son Tarih Hatırlatması" : "تذكير بالموعد النهائي"}</h4>
                            <span className="text-xs text-gray-500">3 days ago</span>
                          </div>
                          <p className="text-sm">
                            {language === "en" ? "Application deadline for Istanbul Technical University is approaching" : 
                            language === "tr" ? "İstanbul Teknik Üniversitesi başvuru son tarihi yaklaşıyor" : 
                            "يقترب الموعد النهائي للتقديم في جامعة إسطنبول التقنية"}
                          </p>
                          <Button variant="link" className="text-amber-500 p-0 h-auto">
                            {language === "en" ? "Apply now" : language === "tr" ? "Şimdi başvur" : "تقدم الآن"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-indigo-500" />
                    {language === "en" && "Support Center"}
                    {language === "tr" && "Destek Merkezi"}
                    {language === "ar" && "مركز الدعم"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" && "Get help with your applications or technical issues"}
                    {language === "tr" && "Başvurularınız veya teknik sorunlarınız için yardım alın"}
                    {language === "ar" && "احصل على مساعدة بشأن طلباتك أو المشكلات الفنية"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-3 inline-block">
                          <HelpCircle className="h-6 w-6 text-indigo-500" />
                        </div>
                        <h3 className="font-medium mb-1">{language === "en" ? "Frequently Asked Questions" : language === "tr" ? "Sıkça Sorulan Sorular" : "أسئلة متكررة"}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {language === "en" ? "Find answers to common questions about the application process" : 
                           language === "tr" ? "Başvuru süreci hakkında sık sorulan soruların cevaplarını bulun" : 
                           "ابحث عن إجابات للأسئلة الشائعة حول عملية التقديم"}
                        </p>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          {language === "en" ? "Browse FAQ" : language === "tr" ? "SSS'a Göz At" : "تصفح الأسئلة الشائعة"}
                        </Button>
                      </div>
                      
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-3 inline-block">
                          <Bell className="h-6 w-6 text-indigo-500" />
                        </div>
                        <h3 className="font-medium mb-1">{language === "en" ? "Contact Support" : language === "tr" ? "Destek İletişimi" : "اتصل بالدعم"}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {language === "en" ? "Get in touch with our support team for personalized assistance" : 
                           language === "tr" ? "Kişiselleştirilmiş yardım için destek ekibimizle iletişime geçin" : 
                           "تواصل مع فريق الدعم لدينا للحصول على مساعدة شخصية"}
                        </p>
                        <Button variant="outline" className="w-full justify-start">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          {language === "en" ? "Contact Us" : language === "tr" ? "Bize Ulaşın" : "اتصل بنا"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                      <h3 className="font-medium mb-4">
                        {language === "en" ? "Send a Message" : language === "tr" ? "Mesaj Gönder" : "إرسال رسالة"}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">{language === "en" ? "Subject" : language === "tr" ? "Konu" : "الموضوع"}</label>
                          <select className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option>{language === "en" ? "Select a topic" : language === "tr" ? "Bir konu seçin" : "حدد موضوعًا"}</option>
                            <option>{language === "en" ? "Application Process" : language === "tr" ? "Başvuru Süreci" : "عملية التقديم"}</option>
                            <option>{language === "en" ? "Document Submission" : language === "tr" ? "Belge Gönderimi" : "تقديم المستندات"}</option>
                            <option>{language === "en" ? "Technical Issue" : language === "tr" ? "Teknik Sorun" : "مشكلة فنية"}</option>
                            <option>{language === "en" ? "Other" : language === "tr" ? "Diğer" : "أخرى"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">{language === "en" ? "Message" : language === "tr" ? "Mesaj" : "رسالة"}</label>
                          <textarea className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 min-h-[100px]" placeholder={language === "en" ? "Describe your issue..." : language === "tr" ? "Sorununuzu açıklayın..." : "صف مشكلتك..."}></textarea>
                        </div>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white w-full">
                          {language === "en" ? "Submit Request" : language === "tr" ? "İstek Gönder" : "إرسال الطلب"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
