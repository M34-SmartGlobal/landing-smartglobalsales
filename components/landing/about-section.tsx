"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { LandingBanner } from "@/lib/actions/landing";

type AboutSectionProps = {
  banners: LandingBanner[];
};

export function AboutSection({ banners }: AboutSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanner = banners[activeIndex];
  const hasControls = banners.length > 1;

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? banners.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === banners.length - 1 ? 0 : current + 1));
  }

  return (
    <section id="nosotros" className="relative bg-gradient-to-b from-white via-brand-red-soft to-white px-6 py-24 text-slate-800 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Nosotros</p>
          <h2 className="mt-5 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Comprometidos con nuestro equipo
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Impulsamos un ambiente dinámico, colaborativo y orientado al crecimiento profesional. En Smart Global Sales cada persona suma energía, talento y resultados para construir una carrera con propósito.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-brand-red/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10">
            {activeBanner ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBanner.id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="relative min-h-[360px] sm:min-h-[460px]"
                >
                  <Image
                    src={activeBanner.imageUrl}
                    alt={activeBanner.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-slate-800 sm:p-8">
                    <h3 className="text-2xl font-black tracking-tight">{activeBanner.title}</h3>
                    {activeBanner.description ? (
                      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                        {activeBanner.description}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center p-8 text-center text-slate-500 sm:min-h-[460px]">
                Agrega banners activos desde el panel administrativo para mostrar imágenes del equipo.
              </div>
            )}
          </div>

          {hasControls ? (
            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
              <button
                onClick={goToPrevious}
                aria-label="Imagen anterior"
                className="flex size-11 items-center justify-center rounded-full border border-brand-red/15 bg-white text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={goToNext}
                aria-label="Imagen siguiente"
                className="flex size-11 items-center justify-center rounded-full border border-brand-red/15 bg-white text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
