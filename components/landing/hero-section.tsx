"use client";

import { motion } from "framer-motion";

import { ApplicationForm } from "@/components/landing/application-form";
import { Button } from "@/components/ui/button";
import type { LandingJobPosition, LandingLocation } from "@/lib/actions/landing";

type HeroSectionProps = {
  jobPositions: LandingJobPosition[];
  locations: LandingLocation[];
};

export function HeroSection({ jobPositions, locations }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-white px-6 py-14 sm:py-18 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(208,0,0,0.16),transparent_30%),linear-gradient(135deg,#ffffff_0%,#fff1f1_46%,#ffffff_100%)]" />
      <div className="absolute inset-0 -z-10 bg-white/40" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-red/15 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        className="mx-auto flex max-w-7xl flex-col items-center gap-10 md:grid md:grid-cols-2 lg:gap-14"
      >
        <div className="text-center md:text-left">
          <p className="mb-5 inline-flex rounded-full border border-brand-red/15 bg-white/90 px-4 py-2 text-sm font-semibold text-brand-red shadow-sm backdrop-blur">
            Convierte tu actitud comercial en una carrera real
          </p>
          <h1 className="text-5xl font-black tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            Únete a Smart Global Sales
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl md:mx-0">
            Forma parte de un equipo comercial dinámico, postula a campañas activas y da el siguiente paso desde nuestras sedes en crecimiento.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <Button size="lg" onClick={() => document.getElementById("postula")?.scrollIntoView()}>
              Únete al equipo
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById("contacto")?.scrollIntoView()}
            >
              Hablar con Smart
            </Button>
          </div>
        </div>

        <div id="postula" className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-red/15 blur-2xl" />
          <ApplicationForm jobPositions={jobPositions} locations={locations} />
        </div>
      </motion.div>
    </section>
  );
}
