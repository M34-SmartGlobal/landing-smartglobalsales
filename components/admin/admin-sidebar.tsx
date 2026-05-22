"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, ImagePlus, Images, LayoutDashboard, MapPin, Newspaper, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/banners", label: "Banners / Hero", icon: ImagePlus },
  { href: "/admin/campaigns", label: "Campañas", icon: Images },
  { href: "/admin/jobs", label: "Puestos", icon: Briefcase },
  { href: "/admin/news", label: "Noticias", icon: Newspaper },
  { href: "/admin/locations", label: "Sedes", icon: MapPin },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/legal", label: "Textos legales", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-brand-line bg-white px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5">
      <Link href="/admin/leads" className="flex items-center gap-3 rounded-3xl bg-brand-black p-4 text-white">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-red font-black">SG</span>
        <span>
          <span className="block text-sm font-black leading-5">Smart Global</span>
          <span className="block text-xs text-white/60">Panel Admin</span>
        </span>
      </Link>

      <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {links.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-brand-muted transition hover:bg-brand-red-soft hover:text-brand-red",
                active && "bg-brand-red text-white shadow-glow hover:bg-brand-red hover:text-white",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 hidden rounded-3xl bg-brand-red-soft p-4 text-sm text-brand-muted lg:block">
        <LayoutDashboard className="mb-3 text-brand-red" size={20} />
        Gestiona postulantes, campañas y contenido legal desde un panel modular.
      </div>
    </aside>
  );
}
