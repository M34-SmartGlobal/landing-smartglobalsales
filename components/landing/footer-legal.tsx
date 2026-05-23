"use client";

import { useState } from "react";
import { X } from "lucide-react";

import type { LandingLegalText } from "@/lib/actions/landing";

type FooterLegalProps = {
  legalTexts: LandingLegalText[];
};

export function FooterLegal({ legalTexts }: FooterLegalProps) {
  const [selectedText, setSelectedText] = useState<LandingLegalText | null>(null);

  return (
    <>
      <footer className="border-t border-brand-line bg-white px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 text-center lg:grid-cols-[1fr_2fr] lg:text-left">
          <div className="mx-auto max-w-sm lg:mx-0">
            <p className="text-2xl font-black tracking-tight text-brand-black">Smart Global Sales</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-brand-muted">
              Captación de talento y gestión comercial con procesos claros, rápidos y seguros.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap lg:justify-end">
            {legalTexts.map((text) => (
              <button
                key={text.id}
                onClick={() => setSelectedText(text)}
                className="text-sm font-medium text-brand-muted transition hover:text-brand-black hover:underline"
              >
                {text.title}
              </button>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-brand-muted">
          © {new Date().getFullYear()} Smart Global Sales. Todos los derechos reservados.
        </p>
      </footer>

      {selectedText ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-800/50 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="max-h-[82vh] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-panel">
            <div className="flex items-start justify-between gap-4 border-b border-brand-line p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Legal</p>
                <h2 className="mt-2 text-2xl font-black text-brand-black">{selectedText.title}</h2>
              </div>
              <button
                onClick={() => setSelectedText(null)}
                aria-label="Cerrar modal"
                className="rounded-full bg-brand-canvas p-3 text-brand-graphite transition hover:bg-brand-red hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 text-sm leading-7 text-brand-muted">
              {selectedText.content}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
