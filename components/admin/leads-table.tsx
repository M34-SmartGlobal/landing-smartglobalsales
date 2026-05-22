"use client";

import { useState } from "react";

import type { ApplicationLeadRow, ContactLeadRow } from "@/lib/actions/admin";
import { downloadCsv } from "@/lib/utils/csv";
import { cn } from "@/lib/utils/cn";

type LeadsTableProps = {
  applications: ApplicationLeadRow[];
  contacts: ContactLeadRow[];
};

type Tab = "applications" | "contacts";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-brand-red-soft px-3 py-1 text-xs font-bold text-brand-red">
      {status}
    </span>
  );
}

export function LeadsTable({ applications, contacts }: LeadsTableProps) {
  const [tab, setTab] = useState<Tab>("applications");
  const activeRows = tab === "applications" ? applications : contacts;

  function exportActive() {
    if (tab === "applications") {
      downloadCsv(
        "postulaciones-smart-global-sales.csv",
        applications.map((lead) => ({
          Fecha: formatDate(lead.created_at),
          Documento: `${lead.document_type} ${lead.document_number}`,
          Nombre: `${lead.first_names} ${lead.last_names ?? ""}`.trim(),
          Celular: lead.phone,
          Campaña: lead.campaign_name_snapshot,
          Sede: lead.location_name_snapshot,
          Estado: lead.status,
        })),
      );
      return;
    }

    downloadCsv(
      "contactos-smart-global-sales.csv",
      contacts.map((lead) => ({
        Fecha: formatDate(lead.created_at),
        Nombre: lead.full_name,
        Correo: lead.email,
        Celular: lead.phone,
        Fuente: lead.discovery_source,
        Mensaje: lead.message,
        Estado: lead.status,
      })),
    );
  }

  return (
    <div className="rounded-[2rem] border border-brand-line bg-white shadow-panel">
      <div className="flex flex-col gap-4 border-b border-brand-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full bg-brand-canvas p-1">
          {[
            ["applications", `Postulaciones (${applications.length})`],
            ["contacts", `Contactos (${contacts.length})`],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value as Tab)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold text-brand-muted transition",
                tab === value && "bg-brand-red text-white shadow-glow",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={exportActive}
          disabled={activeRows.length === 0}
          className="rounded-full bg-brand-black px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-red disabled:cursor-not-allowed disabled:opacity-50"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        {tab === "applications" ? (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-canvas text-xs uppercase tracking-wide text-brand-muted">
              <tr>
                <th className="px-5 py-4">Fecha</th>
                <th className="px-5 py-4">Documento</th>
                <th className="px-5 py-4">Nombre</th>
                <th className="px-5 py-4">Celular</th>
                <th className="px-5 py-4">Campaña</th>
                <th className="px-5 py-4">Sede</th>
                <th className="px-5 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {applications.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand-red-soft/40">
                  <td className="px-5 py-4 text-brand-muted">{formatDate(lead.created_at)}</td>
                  <td className="px-5 py-4 font-semibold">{lead.document_type} {lead.document_number}</td>
                  <td className="px-5 py-4">{lead.first_names} {lead.last_names}</td>
                  <td className="px-5 py-4">{lead.phone}</td>
                  <td className="px-5 py-4">{lead.campaign_name_snapshot ?? "-"}</td>
                  <td className="px-5 py-4">{lead.location_name_snapshot ?? "-"}</td>
                  <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-canvas text-xs uppercase tracking-wide text-brand-muted">
              <tr>
                <th className="px-5 py-4">Fecha</th>
                <th className="px-5 py-4">Nombre</th>
                <th className="px-5 py-4">Correo</th>
                <th className="px-5 py-4">Celular</th>
                <th className="px-5 py-4">Fuente</th>
                <th className="px-5 py-4">Mensaje</th>
                <th className="px-5 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {contacts.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand-red-soft/40">
                  <td className="px-5 py-4 text-brand-muted">{formatDate(lead.created_at)}</td>
                  <td className="px-5 py-4 font-semibold">{lead.full_name}</td>
                  <td className="px-5 py-4">{lead.email}</td>
                  <td className="px-5 py-4">{lead.phone}</td>
                  <td className="px-5 py-4">{lead.discovery_source}</td>
                  <td className="max-w-xs truncate px-5 py-4">{lead.message}</td>
                  <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeRows.length === 0 ? (
          <div className="p-10 text-center text-brand-muted">No hay registros para mostrar.</div>
        ) : null}
      </div>
    </div>
  );
}
