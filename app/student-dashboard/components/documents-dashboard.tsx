"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { FileText, Upload, Check, AlertTriangle, Download, Search, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent, 
  EnhancedCardFooter 
} from "./enhanced-card"
import { Document, getUserDocuments } from "../lib/api"

export function DocumentsDashboard() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Get translation based on language
  const getText = (en: string, tr: string, ar: string) => {
    return language === "en" ? en : language === "tr" ? tr : ar
  }

  // Status translation
  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return getText("Verified", "Doğrulandı", "تم التحقق")
      case "pending":
        return getText("Pending", "Beklemede", "قيد الانتظار")
      case "rejected":
        return getText("Rejected", "Reddedildi", "مرفوض")
      default:
        return status
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": 
        return "bg-green-100 text-green-800"
      case "pending": 
        return "bg-yellow-100 text-yellow-800"
      case "rejected": 
        return "bg-red-100 text-red-800"
      default: 
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get gradient for card
  const getCardGradient = (status: string) => {
    switch (status) {
      case "verified": 
        return "green"
      case "pending": 
        return "amber"
      case "rejected": 
        return "rose"
      default: 
        return "none"
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const data = await getUserDocuments()
        setDocuments(data)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Calculate document stats
  const verifiedCount = documents.filter(doc => doc.status === "verified").length
  const pendingCount = documents.filter(doc => doc.status === "pending").length
  const rejectedCount = documents.filter(doc => doc.status === "rejected").length
  
  // Filter documents based on search and status filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {getText("My Documents", "Belgelerim", "مستنداتي")}
          </h2>
          <p className="text-muted-foreground">
            {getText(
              "Manage and track your required documents",
              "Gerekli belgelerinizi yönetin ve takip edin",
              "إدارة وتتبع المستندات المطلوبة"
            )}
          </p>
        </div>
        <Button className="w-full md:w-auto">
          <Upload className="h-4 w-4 mr-2" />
          {getText("Upload Document", "Belge Yükle", "تحميل مستند")}
        </Button>
      </div>

      {/* Document stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
        <EnhancedCard gradient="blue">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-sm">
              {getText("Total Documents", "Toplam Belgeler", "إجمالي المستندات")}
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </EnhancedCardContent>
        </EnhancedCard>
        
        <EnhancedCard gradient="green">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-sm">
              {getText("Verified", "Doğrulanmış", "تم التحقق")}
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{verifiedCount}</div>
          </EnhancedCardContent>
        </EnhancedCard>
        
        <EnhancedCard gradient="amber">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-sm">
              {getText("Pending", "Beklemede", "قيد الانتظار")}
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </EnhancedCardContent>
        </EnhancedCard>
        
        <EnhancedCard gradient="rose">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-sm">
              {getText("Rejected", "Reddedilmiş", "مرفوض")}
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>

      {/* Document upload progress */}
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>
            {getText("Document Requirements", "Belge Gereksinimleri", "متطلبات المستندات")}
          </EnhancedCardTitle>
          <EnhancedCardDescription>
            {getText(
              "Track your progress in completing required documents",
              "Gerekli belgeleri tamamlama sürecinizi takip edin",
              "تتبع تقدمك في إكمال المستندات المطلوبة"
            )}
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {getText("Overall Progress", "Genel İlerleme", "التقدم العام")}
                </span>
                <span>
                  {verifiedCount}/{documents.length}
                </span>
              </div>
              <Progress 
                value={documents.length > 0 ? (verifiedCount / documents.length) * 100 : 0} 
                className="h-2" 
              />
            </div>

            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {getText("Passport or ID", "Pasaport veya Kimlik", "جواز سفر أو هوية")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {getText("High School Diploma", "Lise Diploması", "شهادة الثانوية العامة")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {getText("Transcripts", "Transkript", "النصوص")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">
                  {getText("Language Certificate", "Dil Sertifikası", "شهادة اللغة")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">
                  {getText("Recommendation Letters", "Tavsiye Mektupları", "خطابات التوصية")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm">
                  {getText("Personal Statement", "Kişisel Yazı", "بيان شخصي")}
                </span>
              </div>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Document search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={getText("Search documents...", "Belgeleri ara...", "البحث في المستندات...")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            className="whitespace-nowrap"
          >
            {getText("All", "Tümü", "الكل")}
          </Button>
          <Button
            variant={statusFilter === "verified" ? "default" : "outline"}
            onClick={() => setStatusFilter("verified")}
            className="whitespace-nowrap"
          >
            {getText("Verified", "Doğrulanmış", "تم التحقق")}
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
            className="whitespace-nowrap"
          >
            {getText("Pending", "Beklemede", "قيد الانتظار")}
          </Button>
        </div>
      </div>

      {loading ? (
        // Skeleton loading state
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
                </div>
              </EnhancedCardContent>
              <EnhancedCardFooter className="border-t pt-4">
                <Skeleton className="h-9 w-full" />
              </EnhancedCardFooter>
            </EnhancedCard>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        // Empty state
        <EnhancedCard className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {getText("No Documents Found", "Belge Bulunamadı", "لم يتم العثور على مستندات")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 
              getText(
                "No documents match your search criteria.",
                "Arama kriterlerinize uygun belge bulunamadı.",
                "لا توجد مستندات تطابق معايير البحث الخاصة بك."
              ) :
              getText(
                "You haven't uploaded any documents yet.",
                "Henüz belge yüklemediniz.",
                "لم تقم بتحميل أي مستندات حتى الآن."
              )
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {getText("Upload Document", "Belge Yükle", "تحميل مستند")}
          </Button>
        </EnhancedCard>
      ) : (
        // Documents grid
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <EnhancedCard 
              key={doc.id} 
              hoverEffect
              gradient={getCardGradient(doc.status) as "blue" | "purple" | "green" | "amber" | "rose" | "none"}
            >
              <EnhancedCardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <EnhancedCardTitle>{doc.name}</EnhancedCardTitle>
                </div>
                <EnhancedCardDescription>{doc.type}</EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {getText("Status", "Durum", "الحالة")}:
                    </span>
                    <Badge 
                      variant="outline"
                      className={`${getStatusColor(doc.status)} border-0`}
                    >
                      {getStatusText(doc.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {getText("Uploaded", "Yüklenme", "تم التحميل")}:
                    </span>
                    <span>
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {getText("Size", "Boyut", "الحجم")}:
                    </span>
                    <span>
                      {formatFileSize(doc.size)}
                    </span>
                  </div>
                </div>
              </EnhancedCardContent>
              <EnhancedCardFooter className="border-t pt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  {getText("View", "Görüntüle", "عرض")}
                </Button>
                <Button variant="outline" className="w-10 p-0" title={getText("Download", "İndir", "تنزيل")}>
                  <Download className="h-4 w-4" />
                </Button>
              </EnhancedCardFooter>
            </EnhancedCard>
          ))}
        </div>
      )}
    </div>
  )
}
