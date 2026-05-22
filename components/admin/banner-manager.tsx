"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminBannerRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type BannerManagerProps = { initialBanners: AdminBannerRow[] };

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function BannerManager({ initialBanners }: BannerManagerProps) {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingBanner, setEditingBanner] = useState<AdminBannerRow | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingBanner(null);
    setTitle("");
    setDescription("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(banner: AdminBannerRow) {
    setEditingBanner(banner);
    setTitle(banner.title);
    setDescription(banner.description ?? "");
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageIfNeeded() {
    const file = fileRef.current?.files?.[0];
    if (!file) return editingBanner?.image_path ?? null;
    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop() ?? "webp";
    const path = `${slugify(title)}-${id}.${extension}`;
    const { error } = await supabase.storage.from("site-banners").upload(path, file, { cacheControl: "3600" });
    if (error) throw error;
    return path;
  }

  async function saveBanner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!title.trim()) return setMessage("Ingresa un título.");
    if (!editingBanner && !fileRef.current?.files?.[0]) return setMessage("Selecciona una imagen.");

    setLoading(true);
    try {
      const imagePath = await uploadImageIfNeeded();
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        image_path: imagePath,
        image_alt: title.trim(),
        is_active: true,
      };
      const { error } = editingBanner
        ? await supabase.from("site_banners").update(payload).eq("id", editingBanner.id)
        : await supabase.from("site_banners").insert(payload);
      if (error) throw error;
      setMessage(editingBanner ? "Banner actualizado correctamente." : "Banner creado correctamente.");
      resetForm();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el banner.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleBanner(banner: AdminBannerRow) {
    const { error } = await supabase.from("site_banners").update({ is_active: !banner.is_active }).eq("id", banner.id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  async function deleteBanner(banner: AdminBannerRow) {
    if (!window.confirm(`¿Eliminar el banner "${banner.title}"?`)) return;
    setMessage(null);
    const { error: dbError } = await supabase.from("site_banners").delete().eq("id", banner.id);
    if (dbError) return setMessage(dbError.message);
    if (banner.image_path) {
      const { error: storageError } = await supabase.storage.from("site-banners").remove([banner.image_path]);
      if (storageError) setMessage(storageError.message);
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={saveBanner} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-xl shadow-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-brand-black">{editingBanner ? "Editar banner" : "Nuevo banner"}</h3>
            <p className="mt-2 text-sm text-brand-muted">Gestiona imágenes y textos de la sección Nosotros.</p>
          </div>
          {editingBanner ? <button type="button" onClick={resetForm} className="text-sm font-bold text-brand-red hover:underline">Cancelar</button> : null}
        </div>
        <div className="mt-6 space-y-5">
          <Input label="Título" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-graphite" htmlFor="banner-description">Descripción</label>
            <textarea id="banner-description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-2xl border border-brand-line px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" />
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="block w-full rounded-2xl border border-brand-line bg-white p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
          {editingBanner ? <p className="text-xs text-brand-muted">Si no seleccionas imagen, se mantiene la actual.</p> : null}
          {message ? <p className="text-sm font-semibold text-brand-red">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Guardando..." : editingBanner ? "Actualizar banner" : "Subir banner"}</Button>
        </div>
      </form>

      <div className="space-y-4">
        {initialBanners.map((banner) => (
          <article key={banner.id} className="grid gap-4 rounded-[2rem] border border-brand-line bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-[180px_1fr_auto] md:items-center">
            <div className="relative h-32 overflow-hidden rounded-3xl bg-brand-canvas">
              <Image src={banner.image_url} alt={banner.image_alt ?? banner.title} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-black text-brand-black">{banner.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-brand-muted">{banner.description ?? "Sin descripción"}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:flex-col">
              <button onClick={() => startEdit(banner)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold hover:border-brand-red hover:text-brand-red">Editar</button>
              <button onClick={() => toggleBanner(banner)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold hover:border-brand-red hover:text-brand-red">{banner.is_active ? "Activo" : "Inactivo"}</button>
              <button onClick={() => deleteBanner(banner)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-brand-red hover:bg-brand-red hover:text-white">Eliminar</button>
            </div>
          </article>
        ))}
        {initialBanners.length === 0 ? <p className="rounded-3xl bg-white p-8 text-center text-brand-muted">No hay banners registrados.</p> : null}
      </div>
    </div>
  );
}
