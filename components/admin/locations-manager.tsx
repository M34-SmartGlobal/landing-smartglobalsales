"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminLocationRow } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/browser";

type LocationsManagerProps = {
  initialLocations: AdminLocationRow[];
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

export function LocationsManager({ initialLocations }: LocationsManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!name.trim()) {
      setMessage("Ingresa el nombre de la sede.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("locations").insert({
      name: name.trim(),
      slug: `${slugify(name)}-${crypto.randomUUID().slice(0, 8)}`,
      city: city.trim() || null,
      address: address.trim() || null,
      is_active: true,
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setName("");
    setCity("");
    setAddress("");
    setMessage("Sede creada correctamente.");
    router.refresh();
  }

  async function updateLocation(id: string, field: "name" | "city" | "address", value: string) {
    const payload = field === "name" ? { name: value, slug: `${slugify(value)}-${id.slice(0, 8)}` } : { [field]: value || null };
    const { error } = await supabase.from("locations").update(payload).eq("id", id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  async function toggleLocation(location: AdminLocationRow) {
    const { error } = await supabase.from("locations").update({ is_active: !location.is_active }).eq("id", location.id);
    if (error) setMessage(error.message);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={createLocation} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-panel">
        <h3 className="text-xl font-black text-brand-black">Nueva sede</h3>
        <div className="mt-6 space-y-5">
          <Input label="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Ciudad" value={city} onChange={(event) => setCity(event.target.value)} />
          <Input label="Dirección" value={address} onChange={(event) => setAddress(event.target.value)} />
          {message ? <p className="text-sm font-semibold text-brand-red">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creando..." : "Crear sede"}</Button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-brand-line bg-white shadow-panel">
        <div className="border-b border-brand-line p-5">
          <h3 className="text-xl font-black text-brand-black">Sedes registradas</h3>
        </div>
        <div className="divide-y divide-brand-line">
          {initialLocations.map((location) => (
            <article key={location.id} className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <Input defaultValue={location.name} onBlur={(event) => updateLocation(location.id, "name", event.target.value)} />
              <Input defaultValue={location.city ?? ""} onBlur={(event) => updateLocation(location.id, "city", event.target.value)} />
              <Input defaultValue={location.address ?? ""} onBlur={(event) => updateLocation(location.id, "address", event.target.value)} />
              <button onClick={() => toggleLocation(location)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold">
                {location.is_active ? "Activa" : "Inactiva"}
              </button>
            </article>
          ))}
          {initialLocations.length === 0 ? <p className="p-8 text-center text-brand-muted">No hay sedes registradas.</p> : null}
        </div>
      </div>
    </div>
  );
}
