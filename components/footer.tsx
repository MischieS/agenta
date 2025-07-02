"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4">
              <Image src="/eduturkia-logo.png" alt="EduTurkia Logo" width={180} height={40} style={{ height: 'auto' }} />
            </div>
            <h3 className="mb-3 text-lg font-semibold">{t("footer.about")}</h3>
            <p className="mb-4 text-muted-foreground">{t("footer.aboutText")}</p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/universities" className="text-muted-foreground hover:text-primary">
                  {t("footer.universities")}
                </Link>
              </li>
              <li>
                <Link href="/fields-of-study" className="text-muted-foreground hover:text-primary">
                  {t("footer.fields")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  {t("footer.blog")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{t("footer.address")}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                <a href="tel:+902121234567" className="text-muted-foreground hover:text-primary">
                  {t("footer.phone")}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                <a href="mailto:info@eduturkia.com" className="text-muted-foreground hover:text-primary">
                  {t("footer.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
