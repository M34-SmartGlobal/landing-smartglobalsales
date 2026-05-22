"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LegalContentRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type LegalEditorProps = {
  initialContents: LegalContentRow[];
};

export function LegalEditor({ initialContents }: LegalEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [contents, setContents] = useState(initialContents);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function updateLocal(id: string, field: keyof LegalContentRow, value: string | boolean) {
    setContents((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function save(item: LegalContentRow) {
    setSavingId(item.id);
    setMessage(null);
    const { error } = await supabase
      .from("legal_contents")
      .update({ title: item.title, content: item.content, is_active: item.is_active })
      .eq("id", item.id);

    setSavingId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Texto actualizado correctamente.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {message ? <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-brand-red shadow-sm">{message}</p> : null}
      {contents.map((item) => (
        <article key={item.id} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-panel">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">{item.key}</p>
              <h3 className="mt-1 text-xl font-black text-brand-black">{item.title}</h3>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold text-brand-graphite">
              <span className={item.is_active ? "h-6 w-11 rounded-full bg-brand-red p-1" : "h-6 w-11 rounded-full bg-slate-300 p-1"}>
                <span className={item.is_active ? "block size-4 translate-x-5 rounded-full bg-white transition" : "block size-4 rounded-full bg-white transition"} />
              </span>
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(event) => updateLocal(item.id, "is_active", event.target.checked)}
                className="sr-only"
              />
              Activo
            </label>
          </div>
          <div className="space-y-4">
            <Input
              label="Título"
              value={item.title}
              onChange={(event) => updateLocal(item.id, "title", event.target.value)}
            />
            <div className="space-y-2">
              <label htmlFor={`content-${item.id}`} className="text-sm font-semibold text-brand-graphite">Contenido</label>
              <textarea
                id={`content-${item.id}`}
                rows={7}
                value={item.content}
                onChange={(event) => updateLocal(item.id, "content", event.target.value)}
                className="w-full resize-y rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              />
            </div>
            <Button onClick={() => save(item)} disabled={savingId === item.id}>
              {savingId === item.id ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </article>
      ))}
      {contents.length === 0 ? <p className="rounded-3xl bg-white p-8 text-center text-brand-muted">No hay textos legales registrados.</p> : null}
    </div>
  );
}
