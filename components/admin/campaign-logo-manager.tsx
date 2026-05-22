"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminCampaignRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type CampaignLogoManagerProps = {
  initialCampaigns: AdminCampaignRow[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CampaignLogoManager({ initialCampaigns }: CampaignLogoManagerProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function uploadCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const file = fileRef.current?.files?.[0];

    if (!name.trim() || !file) {
      setMessage("Ingresa un nombre y selecciona una imagen.");
      return;
    }

    setLoading(true);
    const slug = slugify(name);
    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop() ?? "webp";
    const path = `${slug}-${id}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("campaign-logos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setMessage(uploadError.message);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("campaigns").insert({
      name: name.trim(),
      slug: `${slug}-${id.slice(0, 8)}`,
      logo_path: path,
      logo_alt: `Logo de ${name.trim()}`,
      is_active: true,
      show_in_marquee: true,
    });

    setLoading(false);

    if (insertError) {
      setMessage(insertError.message);
      return;
    }

    setName("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setMessage("Campaña creada correctamente.");
    router.refresh();
  }

  async function toggleMarquee(campaign: AdminCampaignRow) {
    const { error } = await supabase
      .from("campaigns")
      .update({ show_in_marquee: !campaign.show_in_marquee, is_active: !campaign.show_in_marquee })
      .eq("id", campaign.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={uploadCampaign} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-panel">
        <h3 className="text-xl font-black text-brand-black">Nuevo logo de campaña</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Sube un logo de marca/campaña para mostrarlo en el carrusel infinito de la landing.
        </p>
        <div className="mt-6 space-y-5">
          <Input label="Nombre de campaña" placeholder="Ej. Marca aliada" value={name} onChange={(event) => setName(event.target.value)} />
          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-semibold text-brand-graphite">Logo</label>
            <input
              ref={fileRef}
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="block w-full rounded-2xl border border-brand-line bg-white p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </div>
          {message ? <p className="text-sm font-semibold text-brand-red">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Subiendo..." : "Subir campaña"}</Button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-brand-line bg-white shadow-panel">
        <div className="border-b border-brand-line p-5">
          <h3 className="text-xl font-black text-brand-black">Campañas actuales</h3>
        </div>
        <div className="divide-y divide-brand-line">
          {initialCampaigns.map((campaign) => (
            <article key={campaign.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-3xl bg-brand-canvas p-3">
                  {campaign.logo_url ? (
                    <Image src={campaign.logo_url} alt={campaign.logo_alt ?? campaign.name} width={96} height={48} className="max-h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-black text-brand-red">SG</span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-brand-black">{campaign.name}</h4>
                  <p className="text-sm text-brand-muted">{campaign.slug}</p>
                </div>
              </div>
              <button
                onClick={() => toggleMarquee(campaign)}
                className="flex items-center gap-3 rounded-full border border-brand-line px-4 py-2 text-sm font-bold text-brand-graphite"
              >
                <span className={campaign.show_in_marquee ? "h-6 w-11 rounded-full bg-brand-red p-1" : "h-6 w-11 rounded-full bg-slate-300 p-1"}>
                  <span className={campaign.show_in_marquee ? "block size-4 translate-x-5 rounded-full bg-white transition" : "block size-4 rounded-full bg-white transition"} />
                </span>
                {campaign.show_in_marquee ? "Visible" : "Oculto"}
              </button>
            </article>
          ))}
          {initialCampaigns.length === 0 ? <p className="p-8 text-center text-brand-muted">No hay campañas registradas.</p> : null}
        </div>
      </div>
    </div>
  );
}
