"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { LandingBanner } from "@/lib/actions/landing";

type BannerShowcaseProps = {
  banners: LandingBanner[];
};

export function BannerShowcase({ banners }: BannerShowcaseProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section id="nosotros" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Nuestro equipo</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-brand-black sm:text-5xl">
            Personas reales construyendo resultados reales.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {banners.map((banner, index) => (
            <motion.article
              key={banner.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className={index === 0 ? "md:col-span-2" : undefined}
            >
              <div className="group relative min-h-96 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/5">
                <Image
                  src={banner.imageUrl}
                  alt={banner.imageAlt}
                  fill
                  sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover opacity-88 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-slate-800">
                  <h3 className="text-2xl font-black tracking-tight">{banner.title}</h3>
                  {banner.description ? <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{banner.description}</p> : null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
