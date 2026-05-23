import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PublicContactInfo } from "@/lib/actions/landing";

const navItems = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#campanas", label: "Campañas" },
  { href: "#noticias", label: "Noticias" },
];

type SiteHeaderProps = {
  contactInfo: PublicContactInfo;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M14.5 8.2V6.7c0-.7.5-.9.9-.9h2.1V2.2L14.6 2c-3.2 0-4.9 1.9-4.9 5.3v.9H6.5V12h3.2v10h3.9V12h3.2l.5-3.8h-3.8Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M6.8 9.4H3.2V21h3.6V9.4ZM5 7.8a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2ZM21 14.6c0-3.3-1.8-5.4-4.6-5.4-1.7 0-2.8.9-3.3 1.8V9.4H9.6V21h3.6v-6.2c0-1.6.8-2.6 2.1-2.6 1.2 0 2 .8 2 2.6V21H21v-6.4Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M15.2 2h-3.1v13.1a2.8 2.8 0 1 1-2-2.7V9.2a6 6 0 1 0 5.1 5.9V8.4c1.3 1 2.9 1.6 4.6 1.7V7a4.7 4.7 0 0 1-4.6-5Z" />
    </svg>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      aria-label={label}
      href={href || "#"}
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-red sm:size-8"
    >
      {children}
    </a>
  );
}

export function SiteHeader({ contactInfo }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/82 shadow-sm backdrop-blur-xl">
      <div className="bg-brand-red text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-3 py-1.5 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-2 sm:text-xs">
          <div className="flex min-w-0 flex-col gap-1 text-white/90 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
            <a href={`tel:${contactInfo.phone}`} className="inline-flex min-w-0 items-center gap-1.5 transition hover:text-white sm:gap-2">
              <Phone className="size-3 shrink-0 sm:size-3.5" /> <span className="truncate">{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex min-w-0 items-center gap-1.5 transition hover:text-white sm:gap-2">
              <Mail className="size-3 shrink-0 sm:size-3.5" /> <span className="max-w-[220px] truncate sm:max-w-none">{contactInfo.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-white/90 sm:gap-2">
            <span className="hidden sm:inline">Síguenos</span>
            <SocialLink href={contactInfo.facebook} label="Facebook"><FacebookIcon /></SocialLink>
            <SocialLink href={contactInfo.instagram} label="Instagram"><InstagramIcon /></SocialLink>
            <SocialLink href={contactInfo.linkedin} label="LinkedIn"><LinkedinIcon /></SocialLink>
            <SocialLink href={contactInfo.tiktok} label="TikTok"><TikTokIcon /></SocialLink>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative block size-11 overflow-hidden rounded-2xl bg-brand-red shadow-sm sm:size-12">
            <Image src="/smart-global-logo.jpg" alt="Smart Global Sales" fill priority className="object-contain" />
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-bold text-brand-muted transition hover:text-brand-red">
              {item.label}
            </a>
          ))}
        </div>

        <a href="#contacto" className="hidden sm:block">
          <Button size="sm">Contáctanos</Button>
        </a>
      </nav>
    </header>
  );
}
