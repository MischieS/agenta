import { Home, Plane, CreditCard, FileText, MapPin, GraduationCap, Briefcase, BookOpen } from "lucide-react"
import type { ReactNode } from "react"

// Types
export interface LocalizedText {
  en: string
  tr: string
}

export interface DegreeType {
  id: string
  name: LocalizedText
  icon: ReactNode
}

export interface Faculty {
  id: string
  name: LocalizedText
}

export interface Department {
  id: string
  name: LocalizedText
  facultyId: string
  degreeTypeId: string
}

export interface University {
  id: string
  name: LocalizedText
  city: LocalizedText
  logo?: string
}

export interface AdditionalService {
  id: string
  name: LocalizedText
  description: LocalizedText
  icon: ReactNode
}

export interface ContactMethod {
  id: string
  name: LocalizedText
  instantAvailable?: boolean
}

export interface LanguageOption {
  id: string
  name: LocalizedText
}

// Degree types
export const degreeTypes: DegreeType[] = [
  { id: "associate", name: { en: "Associate Degree (2 Years)", tr: "Ön Lisans (2 Yıl)" }, icon: <FileText /> },
  { id: "bachelor", name: { en: "Bachelor's Degree", tr: "Lisans" }, icon: <GraduationCap /> },
  { id: "master", name: { en: "Master's Degree", tr: "Yüksek Lisans" }, icon: <Briefcase /> },
  { id: "phd", name: { en: "PhD", tr: "Doktora" }, icon: <BookOpen /> },
]

// Faculties
export const faculties: Faculty[] = [
  { id: "medicine", name: { en: "Faculty of Medicine", tr: "Tıp Fakültesi" } },
  { id: "dentistry", name: { en: "Faculty of Dentistry", tr: "Diş Hekimliği Fakültesi" } },
  { id: "pharmacy", name: { en: "Faculty of Pharmacy", tr: "Eczacılık Fakültesi" } },
  {
    id: "engineering",
    name: { en: "Faculty of Engineering and Natural Sciences", tr: "Mühendislik ve Doğa Bilimleri Fakültesi" },
  },
  { id: "health", name: { en: "Faculty of Health Sciences", tr: "Sağlık Bilimleri Fakültesi" } },
  {
    id: "economics",
    name: {
      en: "Faculty of Economics, Administrative and Social Sciences",
      tr: "İktisadi, İdari ve Sosyal Bilimler Fakültesi",
    },
  },
  {
    id: "arts",
    name: {
      en: "Faculty of Fine Arts, Design and Architecture",
      tr: "Güzel Sanatlar, Tasarım ve Mimarlık Fakültesi",
    },
  },
  { id: "communication", name: { en: "Faculty of Communication", tr: "İletişim Fakültesi" } },
  {
    id: "humanities",
    name: { en: "Faculty of Humanities and Social Sciences", tr: "İnsan ve Toplum Bilimleri Fakültesi" },
  },
  { id: "law", name: { en: "Faculty of Law", tr: "Hukuk Fakültesi" } },
  { id: "justice", name: { en: "Vocational School of Justice", tr: "Adalet Meslek Yüksekokulu" } },
  {
    id: "healthServices",
    name: { en: "Vocational School of Health Services", tr: "Sağlık Hizmetleri Meslek Yüksekokulu" },
  },
]

// Departments
export const departments: Department[] = [
  // Medicine
  { id: "medicine", name: { en: "Medicine", tr: "Tıp" }, facultyId: "medicine", degreeTypeId: "bachelor" },

  // Dentistry
  { id: "dentistry", name: { en: "Dentistry", tr: "Diş Hekimliği" }, facultyId: "dentistry", degreeTypeId: "bachelor" },

  // Pharmacy
  { id: "pharmacy", name: { en: "Pharmacy", tr: "Eczacılık" }, facultyId: "pharmacy", degreeTypeId: "bachelor" },

  // Engineering
  {
    id: "computerEngineering",
    name: { en: "Computer Engineering", tr: "Bilgisayar Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "softwareEngineering",
    name: { en: "Software Engineering", tr: "Yazılım Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "electricalEngineering",
    name: { en: "Electrical-Electronics Engineering", tr: "Elektrik-Elektronik Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "industrialEngineering",
    name: { en: "Industrial Engineering", tr: "Endüstri Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "civilEngineering",
    name: { en: "Civil Engineering", tr: "İnşaat Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "biomedicalEngineering",
    name: { en: "Biomedical Engineering", tr: "Biyomedikal Mühendisliği" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "molecularBiology",
    name: { en: "Molecular Biology and Genetics", tr: "Moleküler Biyoloji ve Genetik" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },
  {
    id: "mathematics",
    name: { en: "Mathematics", tr: "Matematik" },
    facultyId: "engineering",
    degreeTypeId: "bachelor",
  },

  // Health Sciences
  {
    id: "nursing",
    name: { en: "Nursing", tr: "Hemşirelik" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "physiotherapy",
    name: { en: "Physiotherapy and Rehabilitation", tr: "Fizyoterapi ve Rehabilitasyon" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "nutrition",
    name: { en: "Nutrition and Dietetics", tr: "Beslenme ve Diyetetik" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "midwifery",
    name: { en: "Midwifery", tr: "Ebelik" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "audiology",
    name: { en: "Audiology", tr: "Odyoloji" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "childDevelopment",
    name: { en: "Child Development", tr: "Çocuk Gelişimi" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },
  {
    id: "speechTherapy",
    name: { en: "Speech and Language Therapy", tr: "Dil ve Konuşma Terapisi" },
    facultyId: "health",
    degreeTypeId: "bachelor",
  },

  // Law
  {
    id: "law",
    name: { en: "Law", tr: "Hukuk (Türkçe)" },
    facultyId: "law",
    degreeTypeId: "bachelor",
  },

  // Justice (Associate)
  {
    id: "justice",
    name: { en: "Justice (2 Years)", tr: "Adalet (2 Yıl)" },
    facultyId: "justice",
    degreeTypeId: "associate",
  },
  {
    id: "justiceEvening",
    name: { en: "Justice - Evening Education (2 Years)", tr: "Adalet (İkinci Öğretim) (2 Yıl)" },
    facultyId: "justice",
    degreeTypeId: "associate",
  },

  // Health Services (Associate)
  {
    id: "anesthesia",
    name: { en: "Anesthesia (2 Years)", tr: "Anestezi (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "firstAid",
    name: { en: "First and Emergency Aid (2 Years)", tr: "İlk ve Acil Yardım (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "operatingRoom",
    name: { en: "Operating Room Services (2 Years)", tr: "Ameliyathane Hizmetleri (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "medicalImaging",
    name: { en: "Medical Imaging Techniques (2 Years)", tr: "Tıbbi Görüntüleme Teknikleri (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "medicalLab",
    name: { en: "Medical Laboratory Techniques (2 Years)", tr: "Tıbbi Laboratuvar Teknikleri (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "oralHealth",
    name: { en: "Oral and Dental Health (2 Years)", tr: "Ağız ve Diş Sağlığı (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "dialysis",
    name: { en: "Dialysis (2 Years)", tr: "Diyaliz (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "pharmacyServices",
    name: { en: "Pharmacy Services (2 Years)", tr: "Eczane Hizmetleri (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "physiotherapyAssoc",
    name: { en: "Physiotherapy (2 Years)", tr: "Fizyoterapi (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
  {
    id: "optician",
    name: { en: "Optician (2 Years)", tr: "Optisyenlik (2 Yıl)" },
    facultyId: "healthServices",
    degreeTypeId: "associate",
  },
]

// Universities
export const universities: University[] = [
  {
    id: "istinye",
    name: { en: "Istinye University", tr: "İstinye Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "atlas",
    name: { en: "Istanbul Atlas University", tr: "İstanbul Atlas Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "medipol",
    name: { en: "Istanbul Medipol University", tr: "İstanbul Medipol Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "yeniyuzyil",
    name: { en: "Istanbul Yeni Yuzyil University", tr: "İstanbul Yeni Yüzyıl Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "nisantasi",
    name: { en: "Nisantasi University", tr: "Nişantaşı Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "arel",
    name: { en: "Istanbul Arel University", tr: "İstanbul Arel Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "biruni",
    name: { en: "Biruni University", tr: "Biruni Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "fenerbahce",
    name: { en: "Fenerbahce University", tr: "Fenerbahçe Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "kent",
    name: { en: "Istanbul Kent University", tr: "İstanbul Kent Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "bezmialem",
    name: { en: "Bezmialem Vakif University", tr: "Bezmialem Vakıf Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "acibadem",
    name: { en: "Acibadem Mehmet Ali Aydinlar University", tr: "Acıbadem Mehmet Ali Aydınlar Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "altinbas",
    name: { en: "Altinbas University", tr: "Altınbaş Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "kadir",
    name: { en: "Kadir Has University", tr: "Kadir Has Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "halic",
    name: { en: "Halic University", tr: "Haliç Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "kultur",
    name: { en: "Istanbul Kultur University", tr: "İstanbul Kültür Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "gelisim",
    name: { en: "Istanbul Gelisim University", tr: "İstanbul Gelişim Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "okan",
    name: { en: "Istanbul Okan University", tr: "İstanbul Okan Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "bahcesehir",
    name: { en: "Bahcesehir University", tr: "Bahçeşehir Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "yeditepe",
    name: { en: "Yeditepe University", tr: "Yeditepe Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "beykent",
    name: { en: "Beykent University", tr: "Beykent Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "bilgi",
    name: { en: "Istanbul Bilgi University", tr: "İstanbul Bilgi Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "aydin",
    name: { en: "Istanbul Aydin University", tr: "İstanbul Aydın Üniversitesi" },
    city: { en: "Istanbul", tr: "İstanbul" },
  },
]

// Additional services
export const additionalServices: AdditionalService[] = [
  {
    id: "accommodation",
    name: { en: "Accommodation Assistance", tr: "Konaklama Yardımı" },
    description: {
      en: "Help finding student housing or dormitories",
      tr: "Öğrenci yurdu veya konaklama bulma konusunda yardım",
    },
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "visa",
    name: { en: "Visa Support", tr: "Vize Desteği" },
    description: {
      en: "Guidance through the student visa application process",
      tr: "Öğrenci vizesi başvuru sürecinde rehberlik",
    },
    icon: <Plane className="h-5 w-5" />,
  },
  {
    id: "airportPickup",
    name: { en: "Airport Pickup", tr: "Havaalanı Karşılama" },
    description: {
      en: "Transportation from the airport to your accommodation",
      tr: "Havaalanından konaklamanıza ulaşım",
    },
    icon: <Plane className="h-5 w-5" />,
  },
  {
    id: "orientation",
    name: { en: "City Orientation", tr: "Şehir Oryantasyonu" },
    description: {
      en: "Introduction to Istanbul and important locations",
      tr: "İstanbul ve önemli lokasyonlar hakkında bilgilendirme",
    },
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "healthInsurance",
    name: { en: "Health Insurance Assistance", tr: "Sağlık Sigortası Yardımı" },
    description: {
      en: "Help obtaining mandatory health insurance for students",
      tr: "Öğrenciler için zorunlu sağlık sigortası edinme konusunda yardım",
    },
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "bankAccount",
    name: { en: "Bank Account Setup", tr: "Banka Hesabı Açılışı" },
    description: {
      en: "Assistance with opening a Turkish bank account",
      tr: "Türk bankası hesabı açma konusunda yardım",
    },
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "residencePermit",
    name: { en: "Residence Permit Assistance", tr: "İkamet İzni Yardımı" },
    description: {
      en: "Help with residence permit application and renewal",
      tr: "İkamet izni başvurusu ve yenileme konusunda yardım",
    },
    icon: <FileText className="h-5 w-5" />,
  },
]

// Contact methods
export const contactMethods: ContactMethod[] = [
  { id: "video", name: { en: "Video Call", tr: "Görüntülü Arama" } },
  { id: "phone", name: { en: "Phone Call", tr: "Telefon Görüşmesi" }, instantAvailable: true },
  { id: "whatsapp", name: { en: "WhatsApp", tr: "WhatsApp" }, instantAvailable: true },
  { id: "inPerson", name: { en: "In-Person Meeting", tr: "Yüz Yüze Görüşme" } },
]

// Language options
export const languageOptions: LanguageOption[] = [
  { id: "en", name: { en: "English", tr: "İngilizce" } },
  { id: "tr", name: { en: "Turkish", tr: "Türkçe" } },
  { id: "ar", name: { en: "Arabic", tr: "Arapça" } },
  { id: "fr", name: { en: "French", tr: "Fransızca" } },
  { id: "ru", name: { en: "Russian", tr: "Rusça" } },
]

// Helper functions
export const getDepartmentsByDegreeType = (degreeTypeId: string) => {
  return departments.filter((dept) => dept.degreeTypeId === degreeTypeId)
}

export const getAvailableFaculties = (degreeTypeId: string) => {
  const facultyIds = [
    ...new Set(departments.filter((dept) => dept.degreeTypeId === degreeTypeId).map((dept) => dept.facultyId)),
  ]

  return faculties.filter((faculty) => facultyIds.includes(faculty.id))
}
