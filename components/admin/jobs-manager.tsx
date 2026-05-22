"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminJobPositionRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type JobsManagerProps = {
  initialJobs: AdminJobPositionRow[];
};

export function JobsManager({ initialJobs }: JobsManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!name.trim()) return setMessage("Ingresa el nombre del puesto.");
    setLoading(true);
    const { error } = await supabase.from("job_positions").insert({ name: name.trim(), is_active: true });
    setLoading(false);
    if (error) return setMessage(error.message);
    setName("");
    setMessage("Puesto creado correctamente.");
    router.refresh();
  }

  async function updateJob(id: string, nameValue: string) {
    const { error } = await supabase.from("job_positions").update({ name: nameValue }).eq("id", id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  async function toggleJob(job: AdminJobPositionRow) {
    const { error } = await supabase.from("job_positions").update({ is_active: !job.is_active }).eq("id", job.id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={createJob} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-panel">
        <h3 className="text-xl font-black text-brand-black">Nuevo puesto</h3>
        <div className="mt-6 space-y-5">
          <Input label="Nombre del puesto" placeholder="Ej. Comercial" value={name} onChange={(event) => setName(event.target.value)} />
          {message ? <p className="text-sm font-semibold text-brand-red">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creando..." : "Crear puesto"}</Button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-brand-line bg-white shadow-panel">
        <div className="border-b border-brand-line p-5">
          <h3 className="text-xl font-black text-brand-black">Puestos registrados</h3>
        </div>
        <div className="divide-y divide-brand-line">
          {initialJobs.map((job) => (
            <article key={job.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <Input defaultValue={job.name} onBlur={(event) => updateJob(job.id, event.target.value)} />
              <button onClick={() => toggleJob(job)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold">
                {job.is_active ? "Activo" : "Inactivo"}
              </button>
            </article>
          ))}
          {initialJobs.length === 0 ? <p className="p-8 text-center text-brand-muted">No hay puestos registrados.</p> : null}
        </div>
      </div>
    </div>
  );
}
