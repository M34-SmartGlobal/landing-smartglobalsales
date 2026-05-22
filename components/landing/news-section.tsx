"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { LandingNewsArticle } from "@/lib/actions/landing";

type NewsSectionProps = {
  articles: LandingNewsArticle[];
};

export function NewsSection({ articles }: NewsSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<LandingNewsArticle | null>(null);
  if (articles.length === 0) return null;

  return (
    <>
      <section id="noticias" className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Noticias</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-brand-black sm:text-5xl">
                Últimas Noticias
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="overflow-hidden rounded-[2rem] border border-brand-line bg-white shadow-2xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-black/10">
                <div className="relative h-56 bg-brand-canvas">
                  {article.imageUrl ? (
                    <Image src={article.imageUrl} alt={article.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black tracking-tight text-brand-black">{article.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{article.excerpt}</p>
                  <button onClick={() => setSelectedArticle(article)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-dark">
                    Más Información <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedArticle ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-800/55 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/30"
            >
              <div className="relative h-72 bg-slate-100 sm:h-96">
                {selectedArticle.imageUrl ? (
                  <Image src={selectedArticle.imageUrl} alt={selectedArticle.title} fill className="object-cover" />
                ) : null}
                <button
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Cerrar noticia"
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-brand-black shadow-xl transition hover:bg-brand-red hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[44vh] overflow-y-auto p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Noticia</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-black sm:text-4xl">
                  {selectedArticle.title}
                </h2>
                <div className="mt-6 whitespace-pre-line text-base leading-8 text-brand-graphite">
                  {selectedArticle.content || selectedArticle.excerpt}
                </div>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
