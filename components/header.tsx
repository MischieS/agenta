"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Globe, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/universities", label: t("nav.universities") },
    { href: "/fields-of-study", label: t("nav.fields") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ]

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "tr", label: "Türkçe" },
    { code: "ar", label: "العربية" },
  ]

  // Only render UI that depends on mounted state after component mounts
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full transition-all duration-200 bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <div className="w-[180px] h-[40px] relative">
                <div className="w-full h-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-md dark:bg-gray-900/80' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative" style={{ width: '180px', height: '40px' }}>
              <Image 
                src="/eduturkia-logo.png" 
                alt="Eduturkia Logo"
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{language === "en" ? "EN" : language === "tr" ? "TR" : "AR"}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.code}
                    onClick={() => setLanguage(option.code as "en" | "tr" | "ar")}
                    className={language === option.code ? "bg-muted" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <Button asChild>
              <Link href="/apply">
                {language === "en" && "Apply Now"}
                {language === "tr" && "Şimdi Başvur"}
                {language === "ar" && "قدم الآن"}
              </Link>
            </Button>

            {/* Sign In Button or Dashboard Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1" asChild>
                    <Link href={user?.user?.role?.includes('admin') ? "/admin-dashboard" : "/student-dashboard"}>
                      {language === "en" && "Dashboard"}
                      {language === "tr" && "Kontrol Paneli"}
                      {language === "ar" && "لوحة التحكم"}
                    </Link>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user?.user?.role?.includes('admin') ? "/admin-dashboard" : "/student-dashboard"} className="cursor-pointer w-full">
                      {language === "en" && "Dashboard"}
                      {language === "tr" && "Kontrol Paneli"}
                      {language === "ar" && "لوحة التحكم"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      router.replace("/");
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {language === "en" && "Sign Out"}
                    {language === "tr" && "Çıkış Yap"}
                    {language === "ar" && "تسجيل خروج"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline">
                <Link href="/signin">
                  {language === "en" && "Sign In"}
                  {language === "tr" && "Giriş Yap"}
                  {language === "ar" && "تسجيل الدخول"}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Mobile Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-2">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.code}
                    onClick={() => setLanguage(option.code as "en" | "tr" | "ar")}
                    className={language === option.code ? "bg-muted" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href="/apply">
                    {language === "en" && "Apply Now"}
                    {language === "tr" && "Şimdi Başvur"}
                    {language === "ar" && "قدم الآن"}
                  </Link>
                </Button>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/dashboard">
                        {language === "en" && "Dashboard"}
                        {language === "tr" && "Kontrol Paneli"}
                        {language === "ar" && "لوحة التحكم"}
                      </Link>
                    </Button>
                    <Button
                      onClick={async () => {
                        await logout();
                        router.replace("/");
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {language === "en" && "Sign Out"}
                      {language === "tr" && "Çıkış Yap"}
                      {language === "ar" && "تسجيل خروج"}
                    </Button>
                  </div>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signin">
                      {language === "en" && "Sign In"}
                      {language === "tr" && "Giriş Yap"}
                      {language === "ar" && "تسجيل الدخول"}
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
