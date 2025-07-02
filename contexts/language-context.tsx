"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "tr" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Language selection
    "languages.english": "English",
    "languages.turkish": "Turkish",
    "languages.arabic": "Arabic",
    "languages.another": "Another (Please specify)",
    "languages.pleaseSpecify": "Please write your preferred language",
    
    // Navigation
    "nav.home": "Home",
    "nav.universities": "Universities",
    "nav.fields": "Fields of Study",
    "nav.blog": "Blog",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.apply": "Apply Now",

    // Homepage
    "home.hero.title": "Start Your Academic Journey in Turkey",
    "home.hero.subtitle":
      "Our selection wizard will help you find the best university and program for your academic goals.",
    "home.features.title": "Why Choose Agenta?",
    "home.features.subtitle": "We make studying in Turkey simple and affordable",
    "home.features.discounts": "Discounts & Scholarships",
    "home.features.discounts.desc":
      "Access exclusive tuition discounts and scholarship opportunities through our university partnerships.",
    "home.features.integrity": "Integrity",
    "home.features.integrity.desc":
      "No hidden or extra fees. We're transparent about all costs associated with your education.",
    "home.features.matching": "Personalized Matching",
    "home.features.matching.desc":
      "Find universities and programs that perfectly align with your academic goals and interests.",
    "home.features.orientation": "Complete Orientation",
    "home.features.orientation.desc":
      "Comprehensive guidance on school, social life, city navigation, and cultural adaptation.",
    "home.features.accommodation": "Accommodation",
    "home.features.accommodation.desc":
      "Help finding safe, comfortable, and affordable housing options near your university.",
    "home.features.support": "Lifelong Support",
    "home.features.support.desc": "Ongoing assistance throughout your entire academic journey and life in Turkey.",
    "home.testimonials.title": "Student Success Stories",
    "home.testimonials.subtitle": "Hear from international students who found their perfect match",
    "home.cta.title": "Ready to Start Your Journey?",
    "home.cta.subtitle": "Join thousands of international students who found their perfect university match in Turkey.",
    "home.cta.button": "Apply Now",
    "home.cta.contact": "Contact an Advisor",

    // Footer
    "footer.about": "About EduTurkia",
    "footer.aboutText":
      "EduTurkia helps international students find their perfect educational path in Turkey through personalized guidance and support.",
    "footer.quickLinks": "Quick Links",
    "footer.universities": "Universities",
    "footer.fields": "Fields of Study",
    "footer.blog": "Blog",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.cookies": "Cookie Policy",
    "footer.contact": "Contact Us",
    "footer.address": "Barbaros Boulevard, No: 123, Beşiktaş, Istanbul, Turkey",
    "footer.phone": "+90 212 123 4567",
    "footer.email": "info@eduturkia.com",
    "footer.copyright": "© 2023 EduTurkia. All rights reserved.",

    // Selection Wizard
    "wizard.title": "Application Form",
    "wizard.subtitle": "Complete the form below to start your academic journey in Turkey",
    "wizard.step1": "Your Information",
    "wizard.step2": "Select Your Degree Type",
    "wizard.step3": "Select Your Program and University",
    "wizard.step4": "Choose Additional Services",
    "wizard.step5": "Choose Contact Method",
    "wizard.step6": "Schedule Consultation",
    "wizard.fullName": "Full Name",
    "wizard.fullName.placeholder": "Enter your full name",
    "wizard.email": "Email",
    "wizard.email.placeholder": "Enter your email address",
    "wizard.phone": "Phone Number",
    "wizard.phone.placeholder": "Enter your phone number",
    "wizard.message": "Additional Message (Optional)",
    "wizard.message.placeholder": "Any specific questions or requirements?",
    "wizard.documents.title": "Optional Documents",
    "wizard.documents.subtitle": "Upload any of the following documents to speed up your application process:",
    "wizard.passport": "Passport",
    "wizard.diploma": "High School Diploma",
    "wizard.transcript": "High School Transcript",
    "wizard.remove": "Remove",
    "wizard.upload.passport": "Click to upload passport",
    "wizard.upload.diploma": "Click to upload diploma",
    "wizard.upload.transcript": "Click to upload transcript",
    "wizard.selectDepartments": "Select Departments",
    "wizard.multipleSelection": "You can select multiple",
    "wizard.searchDepartments": "Search departments...",
    "wizard.notSureDepartment": "Not Sure (Our advisors will help you choose)",
    "wizard.selectUniversities": "Select Universities",
    "wizard.searchUniversities": "Search universities...",
    "wizard.notSureUniversity": "Not Sure (Our advisors will recommend the best options for you)",
    "wizard.additionalServices": "Select any additional services you might need (optional)",
    "wizard.contactMethod": "Contact Method",
    "wizard.instantConnection": "You'll be connected instantly after providing your contact information.",
    "wizard.preferredLanguage": "Preferred Language for Communication",
    "wizard.scheduled": "Schedule for a specific time",
    "wizard.instantly": "Connect instantly",
    "wizard.selectDateTime": "Select Date and Time",
    "wizard.selectDate": "Select Date",
    "wizard.selectTime": "Select Time",
    "wizard.selectTimeSlot": "Select a time slot",
    "wizard.whatsappRedirect": "You'll be redirected to WhatsApp after submitting your information.",
    "wizard.callShortly": "We'll call you shortly after receiving your information.",
    "wizard.previous": "Previous",
    "wizard.next": "Next",
    "wizard.submit": "Submit Application",
    "wizard.submitting": "Submitting...",
    "wizard.success": "Thank you for your submission! We will contact you soon.",
    "wizard.error": "There was an error submitting your form. Please try again.",

    // Contact
    "contact.title": "Get in Touch",
    "contact.subtitle":
      "Have questions about studying in Turkey? Our team of education consultants is ready to guide you through every step of your journey.",
    "contact.email": "Email Us",
    "contact.call": "Call Us",
    "contact.visit": "Visit Us",
    "contact.form.title": "Send Us a Message",
    "contact.form.subtitle": "Have a question? Fill out the form below and we'll get back to you as soon as possible.",
    "contact.form.name": "Your Name",
    "contact.form.email": "Your Email",
    "contact.form.message": "Your Message",
    "contact.form.submit": "Send Message",
    "contact.nextSteps": "What Happens Next?",
    "contact.step1.title": "We Receive Your Message",
    "contact.step1.desc": "Your inquiry is immediately sent to our team of education consultants.",
    "contact.step2.title": "Quick Response",
    "contact.step2.desc": "We'll respond within 24 hours (during business days) to acknowledge your inquiry.",
    "contact.step3.title": "Personalized Consultation",
    "contact.step3.desc": "A dedicated consultant will be assigned to help with your specific needs.",
    "contact.step4.title": "Schedule a Meeting",
    "contact.step4.desc": "We'll arrange a call or video meeting to discuss your educational goals in detail.",
    "contact.step5.title": "Tailored Solutions",
    "contact.step5.desc": "We'll provide personalized recommendations based on your preferences and qualifications.",
  },
  tr: {
    // Navigation
    "nav.home": "Ana Sayfa",
    "nav.universities": "Üniversiteler",
    "nav.fields": "Çalışma Alanları",
    "nav.blog": "Blog",
    "nav.about": "Hakkımızda",
    "nav.contact": "İletişim",
    "nav.apply": "Şimdi Başvur",

    // Homepage
    "home.hero.title": "Türkiye'de Akademik Yolculuğunuza Başlayın",
    "home.hero.subtitle":
      "Seçim sihirbazımız, akademik hedefleriniz için en iyi üniversite ve programı bulmanıza yardımcı olacaktır.",
    "home.features.title": "Neden Agenta?",
    "home.features.subtitle": "Türkiye'de eğitimi basit ve uygun fiyatlı hale getiriyoruz",
    "home.features.discounts": "İndirimler ve Burslar",
    "home.features.discounts.desc":
      "Üniversite ortaklıklarımız aracılığıyla özel öğrenim ücreti indirimleri ve burs fırsatlarına erişin.",
    "home.features.integrity": "Dürüstlük",
    "home.features.integrity.desc":
      "Gizli veya ekstra ücret yok. Eğitiminizle ilgili tüm maliyetler konusunda şeffafız.",
    "home.features.matching": "Kişiselleştirilmiş Eşleştirme",
    "home.features.matching.desc":
      "Akademik hedefleriniz ve ilgi alanlarınızla mükemmel uyum sağlayan üniversiteler ve programlar bulun.",
    "home.features.orientation": "Tam Oryantasyon",
    "home.features.orientation.desc":
      "Okul, sosyal yaşam, şehir navigasyonu ve kültürel adaptasyon konularında kapsamlı rehberlik.",
    "home.features.accommodation": "Konaklama",
    "home.features.accommodation.desc":
      "Üniversitenize yakın güvenli, konforlu ve uygun fiyatlı konaklama seçenekleri bulma konusunda yardım.",
    "home.features.support": "Ömür Boyu Destek",
    "home.features.support.desc": "Tüm akademik yolculuğunuz ve Türkiye'deki yaşamınız boyunca sürekli yardım.",
    "home.testimonials.title": "Öğrenci Başarı Hikayeleri",
    "home.testimonials.subtitle": "Mükemmel eşleşmeyi bulan uluslararası öğrencilerden dinleyin",
    "home.cta.title": "Yolculuğunuza Başlamaya Hazır mısınız?",
    "home.cta.subtitle": "Türkiye'de mükemmel üniversite eşleşmesini bulan binlerce uluslararası öğrenciye katılın.",
    "home.cta.button": "Şimdi Başvur",
    "home.cta.contact": "Bir Danışmanla İletişime Geçin",

    // Footer
    "footer.about": "EduTurkia Hakkında",
    "footer.aboutText":
      "EduTurkia, uluslararası öğrencilerin kişiselleştirilmiş rehberlik ve destek ile Türkiye'de mükemmel eğitim yollarını bulmalarına yardımcı olur.",
    "footer.quickLinks": "Hızlı Bağlantılar",
    "footer.universities": "Üniversiteler",
    "footer.fields": "Çalışma Alanları",
    "footer.blog": "Blog",
    "footer.legal": "Yasal",
    "footer.privacy": "Gizlilik Politikası",
    "footer.terms": "Kullanım Şartları",
    "footer.cookies": "Çerez Politikası",
    "footer.contact": "Bize Ulaşın",
    "footer.address": "Barbaros Bulvarı, No: 123, Beşiktaş, İstanbul, Türkiye",
    "footer.phone": "+90 212 123 4567",
    "footer.email": "info@eduturkia.com",
    "footer.copyright": "© 2023 EduTurkia. Tüm hakları saklıdır.",

    // Selection Wizard
    "wizard.title": "Başvuru Formu",
    "wizard.subtitle": "Türkiye'deki akademik yolculuğunuza başlamak için aşağıdaki formu doldurun",
    "wizard.step1": "Bilgileriniz",
    "wizard.step2": "Derece Tipinizi Seçin",
    "wizard.step3": "Programınızı ve Üniversitenizi Seçin",
    "wizard.step4": "Ek Hizmetleri Seçin",
    "wizard.step5": "İletişim Yöntemini Seçin",
    "wizard.step6": "Danışma Randevusu Planlayın",
    "wizard.fullName": "Tam Adınız",
    "wizard.fullName.placeholder": "Tam adınızı girin",
    "wizard.email": "E-posta",
    "wizard.email.placeholder": "E-posta adresinizi girin",
    "wizard.phone": "Telefon Numarası",
    "wizard.phone.placeholder": "Telefon numaranızı girin",
    "wizard.message": "Ek Mesaj (İsteğe Bağlı)",
    "wizard.message.placeholder": "Herhangi bir özel soru veya gereksinim?",
    "wizard.documents.title": "İsteğe Bağlı Belgeler",
    "wizard.documents.subtitle": "Başvuru sürecinizi hızlandırmak için aşağıdaki belgelerden herhangi birini yükleyin:",
    "wizard.passport": "Pasaport",
    "wizard.diploma": "Lise Diploması",
    "wizard.transcript": "Lise Transkripti",
    "wizard.remove": "Kaldır",
    "wizard.upload.passport": "Pasaport yüklemek için tıklayın",
    "wizard.upload.diploma": "Diploma yüklemek için tıklayın",
    "wizard.upload.transcript": "Transkript yüklemek için tıklayın",
    "wizard.selectDepartments": "Bölümleri Seçin",
    "wizard.multipleSelection": "Birden fazla seçebilirsiniz",
    "wizard.searchDepartments": "Bölümleri ara...",
    "wizard.notSureDepartment": "Emin Değilim (Danışmanlarımız seçmenize yardımcı olacak)",
    "wizard.selectUniversities": "Üniversiteleri Seçin",
    "wizard.searchUniversities": "Üniversiteleri ara...",
    "wizard.notSureUniversity": "Emin Değilim (Danışmanlarımız size en iyi seçenekleri önerecek)",
    "wizard.additionalServices": "İhtiyaç duyabileceğiniz ek hizmetleri seçin (isteğe bağlı)",
    "wizard.contactMethod": "İletişim Yöntemi",
    "wizard.instantConnection": "İletişim bilgilerinizi sağladıktan sonra anında bağlanacaksınız.",
    "wizard.preferredLanguage": "İletişim için Tercih Edilen Dil",
    "wizard.scheduled": "Belirli bir zaman için planlayın",
    "wizard.instantly": "Hemen bağlanın",
    "wizard.selectDateTime": "Tarih ve Saat Seçin",
    "wizard.selectDate": "Tarih Seçin",
    "wizard.selectTime": "Saat Seçin",
    "wizard.selectTimeSlot": "Bir zaman dilimi seçin",
    "wizard.whatsappRedirect": "Bilgilerinizi gönderdikten sonra WhatsApp'a yönlendirileceksiniz.",
    "wizard.callShortly": "Bilgilerinizi aldıktan kısa bir süre sonra sizi arayacağız.",
    "wizard.previous": "Önceki",
    "wizard.next": "Sonraki",
    "wizard.submit": "Başvuruyu Gönder",
    "wizard.submitting": "Gönderiliyor...",
    "wizard.success": "Başvurunuz için teşekkür ederiz! En kısa sürede sizinle iletişime geçeceğiz.",
    "wizard.error": "Formunuzu gönderirken bir hata oluştu. Lütfen tekrar deneyin.",

    // Contact
    "contact.title": "İletişime Geçin",
    "contact.subtitle":
      "Türkiye'de eğitim hakkında sorularınız mı var? Eğitim danışmanlarımız, yolculuğunuzun her adımında size rehberlik etmeye hazır.",
    "contact.email": "Bize E-posta Gönderin",
    "contact.call": "Bizi Arayın",
    "contact.visit": "Bizi Ziyaret Edin",
    "contact.form.title": "Bize Mesaj Gönderin",
    "contact.form.subtitle": "Bir sorunuz mu var? Aşağıdaki formu doldurun ve en kısa sürede size geri döneceğiz.",
    "contact.form.name": "Adınız",
    "contact.form.email": "E-posta Adresiniz",
    "contact.form.message": "Mesajınız",
    "contact.form.submit": "Mesaj Gönder",
    "contact.nextSteps": "Sonraki Adımlar Nelerdir?",
    "contact.step1.title": "Mesajınızı Alıyoruz",
    "contact.step1.desc": "Sorgunuz hemen eğitim danışmanlarımız ekibine gönderilir.",
    "contact.step2.title": "Hızlı Yanıt",
    "contact.step2.desc": "Sorgunuzu onaylamak için 24 saat içinde (iş günlerinde) yanıt vereceğiz.",
    "contact.step3.title": "Kişiselleştirilmiş Danışmanlık",
    "contact.step3.desc": "Özel ihtiyaçlarınıza yardımcı olmak için size özel bir danışman atanacaktır.",
    "contact.step4.title": "Toplantı Planlayın",
    "contact.step4.desc":
      "Eğitim hedeflerinizi detaylı olarak görüşmek için bir telefon veya video görüşmesi ayarlayacağız.",
    "contact.step5.title": "Özel Çözümler",
    "contact.step5.desc": "Tercihleriniz ve niteliklerinize dayalı kişiselleştirilmiş öneriler sunacağız.",
    
    // Language selection
    "languages.english": "İngilizce",
    "languages.turkish": "Türkçe",
    "languages.arabic": "Arapça",
    "languages.another": "Diğer (Lütfen belirtin)",
    "languages.pleaseSpecify": "Lütfen tercih ettiğiniz dili yazın",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.universities": "الجامعات",
    "nav.fields": "مجالات الدراسة",
    "nav.blog": "المدونة",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.apply": "قدم الآن",

    // Homepage
    "home.hero.title": "ابدأ رحلتك الأكاديمية في تركيا",
    "home.hero.subtitle": "سيساعدك معالج الاختيار لدينا في العثور على أفضل جامعة وبرنامج لأهدافك الأكاديمية.",
    "home.features.title": "لماذا تختار أجينتا؟",
    "home.features.subtitle": "نجعل الدراسة في تركيا بسيطة وبأسعار معقولة",
    "home.features.discounts": "خصومات ومنح دراسية",
    "home.features.discounts.desc":
      "الوصول إلى خصومات حصرية على الرسوم الدراسية وفرص المنح الدراسية من خلال شراكاتنا الجامعية.",
    "home.features.integrity": "النزاهة",
    "home.features.integrity.desc": "لا رسوم خفية أو إضافية. نحن شفافون بشأن جميع التكاليف المرتبطة بتعليمك.",
    "home.features.matching": "مطابقة شخصية",
    "home.features.matching.desc": "ابحث عن الجامعات والبرامج التي تتوافق تمامًا مع أهدافك الأكاديمية واهتماماتك.",
    "home.features.orientation": "توجيه شامل",
    "home.features.orientation.desc":
      "إرشادات شاملة حول المدرسة والحياة الاجتماعية والتنقل في المدينة والتكيف الثقافي.",
    "home.features.accommodation": "السكن",
    "home.features.accommodation.desc":
      "المساعدة في العثور على خيارات سكن آمنة ومريحة وبأسعار معقولة بالقرب من جامعتك.",
    "home.features.support": "دعم مدى الحياة",
    "home.features.support.desc": "مساعدة مستمرة طوال رحلتك الأكاديمية وحياتك في تركيا.",
    "home.testimonials.title": "قصص نجاح الطلاب",
    "home.testimonials.subtitle": "اسمع من الطلاب الدوليين الذين وجدوا مطابقتهم المثالية",
    "home.cta.title": "هل أنت مستعد لبدء رحلتك؟",
    "home.cta.subtitle": "انضم إلى آلاف الطلاب الدوليين الذين وجدوا جامعتهم المثالية في تركيا.",
    "home.cta.button": "قدم الآن",
    "home.cta.contact": "تواصل مع مستشار",

    // Footer
    "footer.about": "عن إيدوتوركيا",
    "footer.aboutText":
      "تساعد إيدوتوركيا الطلاب الدوليين في العثور على مسارهم التعليمي المثالي في تركيا من خلال التوجيه والدعم الشخصي.",
    "footer.quickLinks": "روابط سريعة",
    "footer.universities": "الجامعات",
    "footer.fields": "مجالات الدراسة",
    "footer.blog": "المدونة",
    "footer.legal": "قانوني",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.cookies": "سياسة ملفات تعريف الارتباط",
    "footer.contact": "اتصل بنا",
    "footer.address": "شارع بارباروس، رقم: 123، بشكتاش، إسطنبول، تركيا",
    "footer.phone": "+90 212 123 4567",
    "footer.email": "info@eduturkia.com",
    "footer.copyright": "© 2023 إيدوتوركيا. جميع الحقوق محفوظة.",

    // Selection Wizard
    "wizard.title": "نموذج التقديم",
    "wizard.subtitle": "أكمل النموذج أدناه لبدء رحلتك الأكاديمية في تركيا",
    "wizard.step1": "معلوماتك",
    "wizard.step2": "اختر نوع الدرجة العلمية",
    "wizard.step3": "اختر برنامجك وجامعتك",
    "wizard.step4": "اختر الخدمات الإضافية",
    "wizard.step5": "اختر طريقة الاتصال",
    "wizard.step6": "جدولة استشارة",
    "wizard.fullName": "الاسم الكامل",
    "wizard.fullName.placeholder": "أدخل اسمك الكامل",
    "wizard.email": "البريد الإلكتروني",
    "wizard.email.placeholder": "أدخل عنوان بريدك الإلكتروني",
    "wizard.phone": "رقم الهاتف",
    "wizard.phone.placeholder": "أدخل رقم هاتفك",
    "wizard.message": "رسالة إضافية (اختياري)",
    "wizard.message.placeholder": "أي أسئلة أو متطلبات محددة؟",
    "wizard.documents.title": "وثائق اختيارية",
    "wizard.documents.subtitle": "قم بتحميل أي من المستندات التالية لتسريع عملية التقديم الخاصة بك:",
    "wizard.passport": "جواز السفر",
    "wizard.diploma": "شهادة الثانوية العامة",
    "wizard.transcript": "كشف درجات المدرسة الثانوية",
    "wizard.remove": "إزالة",
    "wizard.upload.passport": "انقر لتحميل جواز السفر",
    "wizard.upload.diploma": "انقر لتحميل الشهادة",
    "wizard.upload.transcript": "انقر لتحميل كشف الدرجات",
    "wizard.selectDepartments": "اختر الأقسام",
    "wizard.multipleSelection": "يمكنك اختيار متعدد",
    "wizard.searchDepartments": "ابحث عن الأقسام...",
    "wizard.notSureDepartment": "غير متأكد (سيساعدك مستشارونا في الاختيار)",
    "wizard.selectUniversities": "اختر الجامعات",
    "wizard.searchUniversities": "ابحث عن الجامعات...",
    "wizard.notSureUniversity": "غير متأكد (سيوصي مستشارونا بأفضل الخيارات لك)",
    "wizard.additionalServices": "حدد أي خدمات إضافية قد تحتاجها (اختياري)",
    "wizard.contactMethod": "طريقة الاتصال",
    "wizard.instantConnection": "سيتم توصيلك فورًا بعد تقديم معلومات الاتصال الخاصة بك.",
    "wizard.preferredLanguage": "اللغة المفضلة للتواصل",
    "wizard.scheduled": "جدولة لوقت محدد",
    "wizard.instantly": "الاتصال فوراً",
    "wizard.selectDateTime": "حدد التاريخ والوقت",
    "wizard.selectDate": "اختر التاريخ",
    "wizard.selectTime": "اختر الوقت",
    "wizard.selectTimeSlot": "اختر فترة زمنية",
    "wizard.whatsappRedirect": "سيتم توجيهك إلى واتساب بعد إرسال معلوماتك.",
    "wizard.callShortly": "سنتصل بك قريبًا بعد تلقي معلوماتك.",
    "wizard.previous": "السابق",
    "wizard.next": "التالي",
    "wizard.submit": "إرسال الطلب",
    "wizard.submitting": "جاري الإرسال...",
    "wizard.success": "شكرًا لتقديمك! سنتواصل معك قريبًا.",
    "wizard.error": "حدث خطأ أثناء إرسال النموذج الخاص بك. يرجى المحاولة مرة أخرى.",

    // Contact
    "contact.title": "تواصل معنا",
    "contact.subtitle":
      "هل لديك أسئلة حول الدراسة في تركيا؟ فريق مستشاري التعليم لدينا جاهز لإرشادك خلال كل خطوة من رحلتك.",
    "contact.email": "راسلنا عبر البريد الإلكتروني",
    "contact.call": "اتصل بنا",
    "contact.visit": "قم بزيارتنا",
    "contact.form.title": "أرسل لنا رسالة",
    "contact.form.subtitle": "هل لديك سؤال؟ املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.",
    "contact.form.name": "اسمك",
    "contact.form.email": "بريدك الإلكتروني",
    "contact.form.message": "رسالتك",
    "contact.form.submit": "إرسال الرسالة",
    "contact.nextSteps": "ما هي الخطوات التالية؟",
    "contact.step1.title": "نتلقى رسالتك",
    "contact.step1.desc": "يتم إرسال استفسارك فورًا إلى فريق مستشاري التعليم لدينا.",
    "contact.step2.title": "رد سريع",
    "contact.step2.desc": "سنرد خلال 24 ساعة (خلال أيام العمل) للإقرار باستفسارك.",
    "contact.step3.title": "استشارة شخصية",
    "contact.step3.desc": "سيتم تعيين مستشار مخصص لمساعدتك في احتياجاتك المحددة.",
    "contact.step4.title": "جدولة اجتماع",
    "contact.step4.desc": "سنرتب مكالمة هاتفية أو مكالمة فيديو لمناقشة أهدافك التعليمية بالتفصيل.",
    "contact.step5.title": "حلول مخصصة",
    "contact.step5.desc": "سنقدم توصيات مخصصة بناءً على تفضيلاتك ومؤهلاتك.",
    
    // Language selection
    "languages.english": "الإنجليزية",
    "languages.turkish": "التركية",
    "languages.arabic": "العربية",
    "languages.another": "لغة أخرى (يرجى التحديد)",
    "languages.pleaseSpecify": "الرجاء كتابة لغتك المفضلة",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  dir: "ltr",
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "tr", "ar"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)

      // Set the dir attribute on the html element
      const dir = language === "ar" ? "rtl" : "ltr"
      document.documentElement.dir = dir

      // Add or remove RTL class for styling
      if (language === "ar") {
        document.documentElement.classList.add("rtl")
      } else {
        document.documentElement.classList.remove("rtl")
      }
    }
  }, [language, mounted])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
