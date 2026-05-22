import Link from "next/link";
import Image from "next/image";
import { Badge, Camera, Link2, Mail, Phone, Video } from "lucide-react";

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

export function SiteHeader({ contactInfo }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/82 shadow-sm backdrop-blur-xl">
      <div className="bg-brand-red text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/90">
            <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center gap-2 transition hover:text-white">
              <Phone size={14} /> {contactInfo.phone}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
              <Mail size={14} /> {contactInfo.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <span className="hidden sm:inline">Síguenos</span>
            <a aria-label="Facebook" href={contactInfo.facebook} className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-red"><Badge size={15} /></a>
            <a aria-label="LinkedIn" href={contactInfo.linkedin} className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-red"><Link2 size={15} /></a>
            <a aria-label="Instagram" href={contactInfo.facebook} className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-red"><Camera size={15} /></a>
            <a aria-label="TikTok" href={contactInfo.tiktok} className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-red"><Video size={15} /></a>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative block h-12 w-24 overflow-hidden rounded-2xl bg-brand-red shadow-sm sm:w-32">
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
