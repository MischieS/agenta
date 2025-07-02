"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+90 555 123 4567",
    address: "123 Main Street, Apartment 4B, Istanbul",
    bio: "International student pursuing Bachelor's degree in Computer Engineering",
    notifications: {
      email: true,
      push: true,
      sms: false,
      applicationUpdates: true,
      marketingMessages: false,
    },
    language: "en",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would update the user profile
    console.log("Form submitted:", formData)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" && "Account Settings"}
          {language === "tr" && "Hesap Ayarları"}
          {language === "ar" && "إعدادات الحساب"}
        </h1>
        <p className="text-gray-500">
          {language === "en" && "Manage your profile and account settings"}
          {language === "tr" && "Profilinizi ve hesap ayarlarınızı yönetin"}
          {language === "ar" && "إدارة ملفك الشخصي وإعدادات حسابك"}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile">
            {language === "en" && "Profile"}
            {language === "tr" && "Profil"}
            {language === "ar" && "الملف الشخصي"}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {language === "en" && "Notifications"}
            {language === "tr" && "Bildirimler"}
            {language === "ar" && "إشعارات"}
          </TabsTrigger>
          <TabsTrigger value="security">
            {language === "en" && "Security"}
            {language === "tr" && "Güvenlik"}
            {language === "ar" && "حماية"}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>
                  {language === "en" && "Personal Information"}
                  {language === "tr" && "Kişisel Bilgiler"}
                  {language === "ar" && "معلومات شخصية"}
                </CardTitle>
                <CardDescription>
                  {language === "en" && "Update your personal profile information"}
                  {language === "tr" && "Kişisel profil bilgilerinizi güncelleyin"}
                  {language === "ar" && "تحديث معلومات ملفك الشخصي"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {language === "en" && "Full Name"}
                      {language === "tr" && "Ad Soyad"}
                      {language === "ar" && "الاسم الكامل"}
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === "en" && "Email Address"}
                      {language === "tr" && "E-posta Adresi"}
                      {language === "ar" && "عنوان البريد الإلكتروني"}
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === "en" && "Phone Number"}
                      {language === "tr" && "Telefon Numarası"}
                      {language === "ar" && "رقم الهاتف"}
                    </Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      {language === "en" && "Preferred Language"}
                      {language === "tr" && "Tercih Edilen Dil"}
                      {language === "ar" && "اللغة المفضلة"}
                    </Label>
                    <select 
                      id="language" 
                      name="language" 
                      value={formData.language} 
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="en">English</option>
                      <option value="tr">Türkçe</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    {language === "en" && "Address"}
                    {language === "tr" && "Adres"}
                    {language === "ar" && "عنوان"}
                  </Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    {language === "en" && "Bio"}
                    {language === "tr" && "Biyografi"}
                    {language === "ar" && "السيرة الذاتية"}
                  </Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  {language === "en" && "Save Changes"}
                  {language === "tr" && "Değişiklikleri Kaydet"}
                  {language === "ar" && "حفظ التغييرات"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" && "Notification Settings"}
                {language === "tr" && "Bildirim Ayarları"}
                {language === "ar" && "إعدادات الإشعار"}
              </CardTitle>
              <CardDescription>
                {language === "en" && "Manage how you receive notifications"}
                {language === "tr" && "Bildirimleri nasıl alacağınızı yönetin"}
                {language === "ar" && "إدارة كيفية تلقي الإشعارات"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" && "Notification Channels"}
                  {language === "tr" && "Bildirim Kanalları"}
                  {language === "ar" && "قنوات الإخطار"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {language === "en" && "Email Notifications"}
                        {language === "tr" && "E-posta Bildirimleri"}
                        {language === "ar" && "إشعارات البريد الإلكتروني"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" && "Receive notifications via email"}
                        {language === "tr" && "E-posta yoluyla bildirimler alın"}
                        {language === "ar" && "تلقي الإشعارات عبر البريد الإلكتروني"}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications.email} 
                      onCheckedChange={(value) => handleNotificationChange("email", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {language === "en" && "Push Notifications"}
                        {language === "tr" && "Anında Bildirimler"}
                        {language === "ar" && "دفع الإخطارات"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" && "Receive push notifications"}
                        {language === "tr" && "Anında bildirimler alın"}
                        {language === "ar" && "تلقي الإشعارات الفورية"}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications.push} 
                      onCheckedChange={(value) => handleNotificationChange("push", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {language === "en" && "SMS Notifications"}
                        {language === "tr" && "SMS Bildirimleri"}
                        {language === "ar" && "إشعارات الرسائل القصيرة"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" && "Receive notifications via SMS"}
                        {language === "tr" && "SMS yoluyla bildirimler alın"}
                        {language === "ar" && "تلقي الإشعارات عبر الرسائل القصيرة"}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications.sms} 
                      onCheckedChange={(value) => handleNotificationChange("sms", value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">
                  {language === "en" && "Notification Types"}
                  {language === "tr" && "Bildirim Türleri"}
                  {language === "ar" && "أنواع الإخطارات"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {language === "en" && "Application Updates"}
                        {language === "tr" && "Başvuru Güncellemeleri"}
                        {language === "ar" && "تحديثات التطبيق"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" && "Receive updates about your applications"}
                        {language === "tr" && "Başvurularınız hakkında güncellemeler alın"}
                        {language === "ar" && "تلقي تحديثات حول تطبيقاتك"}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications.applicationUpdates} 
                      onCheckedChange={(value) => handleNotificationChange("applicationUpdates", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {language === "en" && "Marketing Messages"}
                        {language === "tr" && "Pazarlama Mesajları"}
                        {language === "ar" && "رسائل تسويقية"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" && "Receive marketing and promotional messages"}
                        {language === "tr" && "Pazarlama ve promosyon mesajları alın"}
                        {language === "ar" && "تلقي رسائل تسويقية وترويجية"}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications.marketingMessages} 
                      onCheckedChange={(value) => handleNotificationChange("marketingMessages", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                {language === "en" && "Save Notification Settings"}
                {language === "tr" && "Bildirim Ayarlarını Kaydet"}
                {language === "ar" && "حفظ إعدادات الإشعار"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" && "Security Settings"}
                {language === "tr" && "Güvenlik Ayarları"}
                {language === "ar" && "إعدادات الأمان"}
              </CardTitle>
              <CardDescription>
                {language === "en" && "Manage your account security"}
                {language === "tr" && "Hesap güvenliğinizi yönetin"}
                {language === "ar" && "إدارة أمان حسابك"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  {language === "en" && "Current Password"}
                  {language === "tr" && "Mevcut Şifre"}
                  {language === "ar" && "كلمة المرور الحالية"}
                </Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  {language === "en" && "New Password"}
                  {language === "tr" && "Yeni Şifre"}
                  {language === "ar" && "كلمة مرور جديدة"}
                </Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {language === "en" && "Confirm New Password"}
                  {language === "tr" && "Yeni Şifreyi Onayla"}
                  {language === "ar" && "تأكيد كلمة المرور الجديدة"}
                </Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                {language === "en" && "Update Password"}
                {language === "tr" && "Şifreyi Güncelle"}
                {language === "ar" && "تحديث كلمة المرور"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" && "Two-Factor Authentication"}
                {language === "tr" && "İki Faktörlü Kimlik Doğrulama"}
                {language === "ar" && "المصادقة الثنائية"}
              </CardTitle>
              <CardDescription>
                {language === "en" && "Add an extra layer of security to your account"}
                {language === "tr" && "Hesabınıza ekstra bir güvenlik katmanı ekleyin"}
                {language === "ar" && "أضف طبقة أمان إضافية إلى حسابك"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                {language === "en" && "Enable Two-Factor Authentication"}
                {language === "tr" && "İki Faktörlü Kimlik Doğrulamayı Etkinleştir"}
                {language === "ar" && "تمكين المصادقة الثنائية"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
