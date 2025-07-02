"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Settings, Save, Upload } from "lucide-react";

// This is a standalone component for the Settings tab that can be imported in the main dashboard
export const SettingsTab = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            {language === "en" && "Account Settings"}
            {language === "tr" && "Hesap Ayarları"}
            {language === "ar" && "إعدادات الحساب"}
          </CardTitle>
          <CardDescription>
            {language === "en" && "Manage your account settings and preferences"}
            {language === "tr" && "Hesap ayarlarınızı ve tercihlerinizi yönetin"}
            {language === "ar" && "إدارة إعدادات وتفضيلات حسابك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h3 className="font-medium mb-4 pb-2 border-b text-purple-600 dark:text-purple-400">
                {language === "en" ? "Personal Information" : language === "tr" ? "Kişisel Bilgiler" : "معلومات شخصية"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                
                {/* Name field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Name" : language === "tr" ? "Ad" : "الاسم"}
                  </Label>
                  <Input 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.name || ""} 
                    placeholder={language === "en" ? "Enter your name" : 
                                language === "tr" ? "Adınızı girin" : 
                                "أدخل اسمك"}
                  />
                </div>
                
                {/* Surname field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Surname" : language === "tr" ? "Soyad" : "اللقب"}
                  </Label>
                  <Input 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.surname || ""} 
                    placeholder={language === "en" ? "Enter your surname" : 
                                language === "tr" ? "Soyadınızı girin" : 
                                "أدخل لقبك"}
                  />
                </div>
                
                {/* Email field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Email" : language === "tr" ? "E-posta" : "البريد الإلكتروني"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="email" 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.email || ""}
                    placeholder="email@example.com" 
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "en" ? "Required for account verification" : 
                     language === "tr" ? "Hesap doğrulaması için gerekli" : 
                     "مطلوب للتحقق من الحساب"}
                  </p>
                </div>
                
                {/* Phone field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Phone Number" : language === "tr" ? "Telefon Numarası" : "رقم الهاتف"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="tel" 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.phone || ""}
                    placeholder="+1 (555) 123-4567"
                    maxLength={20}
                    required
                  />
                </div>
                
                {/* Birthdate field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Birthdate" : language === "tr" ? "Doğum Tarihi" : "تاريخ الميلاد"}
                  </Label>
                  <Input 
                    type="date" 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : ""}
                  />
                </div>
              </div>
            </div>
            
            {/* Address Information Section */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h3 className="font-medium mb-4 pb-2 border-b text-purple-600 dark:text-purple-400">
                {language === "en" ? "Address Information" : language === "tr" ? "Adres Bilgileri" : "معلومات العنوان"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Country field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Country" : language === "tr" ? "Ülke" : "البلد"}
                  </Label>
                  <Select defaultValue={user?.country || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === "en" ? "Select country" : 
                                              language === "tr" ? "Ülke seçin" : 
                                              "اختر البلد"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="tr">Turkey</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="cn">China</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="sa">Saudi Arabia</SelectItem>
                      <SelectItem value="ae">UAE</SelectItem>
                      <SelectItem value="eg">Egypt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Address field */}
                <div className="sm:col-span-2">
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Address" : language === "tr" ? "Adres" : "العنوان"}
                  </Label>
                  <Textarea 
                    className="w-full min-h-[100px] transition-all duration-200 focus:border-purple-400 focus:ring-purple-400" 
                    defaultValue={user?.address || ""}
                    placeholder={language === "en" ? "Enter your full address" : 
                                language === "tr" ? "Tam adresinizi girin" : 
                                "أدخل عنوانك الكامل"}
                  />
                </div>
              </div>
            </div>
            
            {/* Password Section */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h3 className="font-medium mb-4 pb-2 border-b text-purple-600 dark:text-purple-400">
                {language === "en" ? "Security" : language === "tr" ? "Güvenlik" : "الأمان"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Current Password field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "Current Password" : language === "tr" ? "Mevcut Şifre" : "كلمة المرور الحالية"}
                  </Label>
                  <Input 
                    type="password" 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* New Password field */}
                <div>
                  <Label className="flex items-center gap-1">
                    {language === "en" ? "New Password" : language === "tr" ? "Yeni Şifre" : "كلمة المرور الجديدة"}
                  </Label>
                  <Input 
                    type="password" 
                    className="w-full transition-all duration-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "en" ? "Leave blank to keep current password" : 
                     language === "tr" ? "Mevcut şifreyi korumak için boş bırakın" : 
                     "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Profile Picture Section */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h3 className="font-medium mb-4 pb-2 border-b text-purple-600 dark:text-purple-400">
                {language === "en" ? "Profile Picture" : language === "tr" ? "Profil Resmi" : "صورة الملف الشخصي"}
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Current profile picture */}
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user?.["pp-s3-link"] ? (
                    <img 
                      src={user["pp-s3-link"]} 
                      alt={language === "en" ? "Profile Picture" : 
                          language === "tr" ? "Profil Resmi" : 
                          "صورة الملف الشخصي"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                
                {/* Upload controls */}
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/*"
                    className="w-full mb-2" 
                    id="profile-picture"
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {language === "en" ? "Upload Picture" : 
                     language === "tr" ? "Resim Yükle" : 
                     "تحميل صورة"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "en" ? "Maximum file size: 5MB. Recommended: 300x300px" : 
                     language === "tr" ? "Maksimum dosya boyutu: 5MB. Önerilen: 300x300px" : 
                     "الحد الأقصى لحجم الملف: 5 ميجابايت. الموصى به: 300 × 300 بكسل"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Preferences Section */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h3 className="font-medium mb-4 pb-2 border-b text-purple-600 dark:text-purple-400">
                {language === "en" ? "Preferences" : language === "tr" ? "Tercihler" : "التفضيلات"}
              </h3>
              <div className="space-y-4">
                {/* Language preference */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Language" : language === "tr" ? "Dil" : "اللغة"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Select your preferred language" : 
                       language === "tr" ? "Tercih ettiğiniz dili seçin" : 
                       "حدد لغتك المفضلة"}
                    </p>
                  </div>
                  <Select defaultValue={language}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Email notifications */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Email Notifications" : 
                       language === "tr" ? "E-posta Bildirimleri" : 
                       "إشعارات البريد الإلكتروني"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Receive updates about your applications" : 
                       language === "tr" ? "Başvurularınızla ilgili güncellemeleri alın" : 
                       "تلقي تحديثات حول طلباتك"}
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">
            {language === "en" ? "Cancel" : language === "tr" ? "İptal" : "إلغاء"}
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            {language === "en" ? "Save Changes" : language === "tr" ? "Değişiklikleri Kaydet" : "حفظ التغييرات"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsTab;
