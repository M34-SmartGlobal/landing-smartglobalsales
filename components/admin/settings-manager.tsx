"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";

type SettingsManagerProps = {
  initialValue: Record<string, string>;
  initialServicesText: string;
};

export function SettingsManager({ initialValue, initialServicesText }: SettingsManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    phone: initialValue.phone ?? "",
    email: initialValue.email ?? "",
    facebook: initialValue.facebook ?? "",
    instagram: initialValue.instagram ?? "",
    linkedin: initialValue.linkedin ?? "",
    tiktok: initialValue.tiktok ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [servicesText, setServicesText] = useState(initialServicesText);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const [{ error }, { error: servicesError }] = await Promise.all([
      supabase.from("site_settings").upsert({ key: "public_contact_info", value: form }, { onConflict: "key" }),
      supabase.from("site_settings").upsert({ key: "public_services_text", value: servicesText }, { onConflict: "key" }),
    ]);

    setLoading(false);

    if (error || servicesError) {
      setMessage(error?.message ?? servicesError?.message ?? "No se pudo guardar la configuración.");
      return;
    }

    setMessage("Configuración actualizada correctamente.");
    router.refresh();
  }

  return (
    <form onSubmit={saveSettings} className="max-w-3xl rounded-[2rem] border border-brand-line bg-white p-6 shadow-panel">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Teléfono de contacto" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
        <Input label="Correo principal" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        <Input label="Facebook URL" value={form.facebook} onChange={(event) => updateField("facebook", event.target.value)} />
        <Input label="Instagram URL" value={form.instagram} onChange={(event) => updateField("instagram", event.target.value)} />
        <Input label="LinkedIn URL" value={form.linkedin} onChange={(event) => updateField("linkedin", event.target.value)} />
        <Input label="TikTok URL" value={form.tiktok} onChange={(event) => updateField("tiktok", event.target.value)} />
      </div>
      <div className="mt-5 space-y-2">
        <label htmlFor="servicesText" className="text-sm font-semibold text-brand-graphite">Texto de servicios</label>
        <textarea
          id="servicesText"
          rows={8}
          value={servicesText}
          onChange={(event) => setServicesText(event.target.value)}
          className="w-full rounded-2xl border border-brand-line px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
        />
      </div>
      {message ? <p className="mt-5 text-sm font-semibold text-brand-red">{message}</p> : null}
      <Button type="submit" className="mt-6" disabled={loading}>{loading ? "Guardando..." : "Guardar configuración"}</Button>
    </form>
  );
}
