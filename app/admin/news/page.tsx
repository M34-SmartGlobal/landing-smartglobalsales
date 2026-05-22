import { NewsManager } from "@/components/admin/news-manager";
import { getAdminNewsArticles } from "@/lib/actions/admin";

export default async function AdminNewsPage() {
  const articles = await getAdminNewsArticles();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Contenido</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Noticias</h2>
        <p className="mt-2 text-brand-muted">Publica noticias con imagen, título y extracto para la landing.</p>
      </div>
      <NewsManager initialArticles={articles} />
    </section>
  );
}
