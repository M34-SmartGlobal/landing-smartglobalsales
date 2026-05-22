"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminNewsArticleRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type NewsManagerProps = { initialArticles: AdminNewsArticleRow[] };

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewsManager({ initialArticles }: NewsManagerProps) {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingArticle, setEditingArticle] = useState<AdminNewsArticleRow | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingArticle(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(article: AdminNewsArticleRow) {
    setEditingArticle(article);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content ?? article.excerpt);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageIfNeeded() {
    const file = fileRef.current?.files?.[0];
    if (!file) return editingArticle?.image_path ?? null;

    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop() ?? "webp";
    const imagePath = `${slugify(title)}-${id}.${extension}`;
    const { error } = await supabase.storage
      .from("news-images")
      .upload(imagePath, file, { cacheControl: "3600" });

    if (error) throw error;
    return imagePath;
  }

  async function saveArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setMessage("Ingresa título, extracto y cuerpo de la noticia.");
      return;
    }

    setLoading(true);
    try {
      const imagePath = await uploadImageIfNeeded();
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        image_path: imagePath,
        is_active: true,
      };

      const { error } = editingArticle
        ? await supabase.from("news_articles").update(payload).eq("id", editingArticle.id)
        : await supabase.from("news_articles").insert(payload);

      if (error) throw error;

      setMessage(editingArticle ? "Noticia actualizada correctamente." : "Noticia creada correctamente.");
      resetForm();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la noticia.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleArticle(article: AdminNewsArticleRow) {
    const { error } = await supabase
      .from("news_articles")
      .update({ is_active: !article.is_active })
      .eq("id", article.id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  async function deleteArticle(article: AdminNewsArticleRow) {
    if (!window.confirm(`¿Eliminar la noticia "${article.title}"?`)) return;
    setMessage(null);
    const { error: dbError } = await supabase.from("news_articles").delete().eq("id", article.id);
    if (dbError) return setMessage(dbError.message);
    if (article.image_path) {
      const { error: storageError } = await supabase.storage.from("news-images").remove([article.image_path]);
      if (storageError) setMessage(storageError.message);
    }
    if (editingArticle?.id === article.id) resetForm();
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
      <form onSubmit={saveArticle} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-2xl shadow-black/8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-brand-black">
              {editingArticle ? "Editar noticia" : "Nueva noticia"}
            </h3>
            <p className="mt-2 text-sm text-brand-muted">
              Completa título, extracto, cuerpo e imagen para publicar en la landing.
            </p>
          </div>
          {editingArticle ? (
            <button type="button" onClick={resetForm} className="text-sm font-bold text-brand-red hover:underline">
              Cancelar
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-5">
          <Input label="Título" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-graphite" htmlFor="excerpt">Extracto</label>
            <textarea id="excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="w-full rounded-2xl border border-brand-line px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-graphite" htmlFor="content">Cuerpo de la noticia</label>
            <textarea id="content" rows={8} value={content} onChange={(event) => setContent(event.target.value)} className="w-full rounded-2xl border border-brand-line px-4 py-3 text-sm leading-6 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" />
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="block w-full rounded-2xl border border-brand-line bg-white p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
          {editingArticle?.image_url ? <p className="text-xs text-brand-muted">Si no seleccionas imagen, se mantiene la actual.</p> : null}
          {message ? <p className="text-sm font-semibold text-brand-red">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : editingArticle ? "Actualizar noticia" : "Publicar noticia"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {initialArticles.map((article) => (
          <article key={article.id} className="grid gap-4 rounded-[2rem] border border-brand-line bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-[160px_1fr_auto] md:items-center">
            <div className="relative h-28 overflow-hidden rounded-3xl bg-brand-canvas">
              {article.image_url ? <Image src={article.image_url} alt={article.title} fill className="object-cover" /> : null}
            </div>
            <div>
              <h3 className="font-black text-brand-black">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-brand-muted">{article.excerpt}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:flex-col">
              <button onClick={() => startEdit(article)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold hover:border-brand-red hover:text-brand-red">
                Editar
              </button>
              <button onClick={() => toggleArticle(article)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold hover:border-brand-red hover:text-brand-red">
                {article.is_active ? "Activo" : "Inactivo"}
              </button>
              <button onClick={() => deleteArticle(article)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-brand-red hover:bg-brand-red hover:text-white">
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {initialArticles.length === 0 ? <p className="rounded-3xl bg-white p-8 text-center text-brand-muted">No hay noticias registradas.</p> : null}
      </div>
    </div>
  );
}
