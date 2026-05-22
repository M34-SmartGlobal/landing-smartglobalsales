"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  submitApplication,
  type LandingJobPosition,
  type LandingLocation,
} from "@/lib/actions/landing";

const schema = z.object({
  documentType: z.string().min(1, "Selecciona el tipo de documento."),
  documentNumber: z.string().min(6, "Ingresa un documento válido."),
  firstNames: z.string().min(2, "Ingresa tus nombres."),
  lastNames: z.string().optional(),
  phone: z.string().min(9, "Ingresa un celular válido."),
  campaignId: z.string().min(1, "Selecciona una campaña."),
  locationId: z.string().min(1, "Selecciona una sede."),
  consentAccepted: z.boolean().refine(Boolean, {
    message: "Debes aceptar el tratamiento de datos personales.",
  }),
});

type ApplicationFormData = z.infer<typeof schema>;

type ApplicationFormProps = {
  jobPositions: LandingJobPosition[];
  locations: LandingLocation[];
};

export function ApplicationForm({ jobPositions, locations }: ApplicationFormProps) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      firstNames: "",
      lastNames: "",
      phone: "",
      campaignId: "",
      locationId: "",
      consentAccepted: false,
    },
  });

  async function onSubmit(values: ApplicationFormData) {
    setResult(null);
    const response = await submitApplication(values);
    setResult(response);

    if (response.ok) {
      reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-[2rem] border border-white/70 bg-white p-4 shadow-2xl shadow-black/10 ring-1 ring-brand-red/5 sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-red">Postula ahora</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-black">Queremos conocerte</h2>
        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Completa tus datos y elige la campaña y sede de interés.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Tipo de documento"
              options={[
                { label: "DNI", value: "DNI" },
                { label: "Carné de extranjería", value: "CE" },
                { label: "Pasaporte", value: "PASAPORTE" },
              ]}
              error={errors.documentType?.message}
              {...register("documentType")}
            />
            <Input
              label="Número de documento"
              placeholder="Ej. 12345678"
              error={errors.documentNumber?.message}
              {...register("documentNumber")}
            />
            <Input
              label="Nombres"
              placeholder="Tus nombres"
              error={errors.firstNames?.message}
              {...register("firstNames")}
            />
            <Input label="Apellidos" placeholder="Tus apellidos" {...register("lastNames")} />
            <Input
              label="Celular"
              placeholder="Ej. 987654321"
              inputMode="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Select
              label="Puesto de trabajo"
              options={jobPositions.map((position) => ({ label: position.name, value: position.id }))}
              error={errors.campaignId?.message}
              {...register("campaignId")}
            />
            <div className="sm:col-span-2">
              <Select
                label="Sede"
                options={locations.map((location) => ({ label: location.name, value: location.id }))}
                error={errors.locationId?.message}
                {...register("locationId")}
              />
            </div>
      </div>

      <label className="mt-5 flex gap-3 rounded-2xl bg-brand-red-soft p-4 text-sm leading-6 text-brand-graphite">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-brand-line accent-brand-red"
              {...register("consentAccepted")}
            />
            <span>
              Acepto el tratamiento de mis datos personales para fines de contacto y evaluación de mi postulación.
              {errors.consentAccepted ? (
                <strong className="mt-1 block font-semibold text-brand-red">
                  {errors.consentAccepted.message}
                </strong>
              ) : null}
            </span>
      </label>

      {result ? (
        <p className={result.ok ? "mt-5 text-sm font-semibold text-green-700" : "mt-5 text-sm font-semibold text-brand-red"}>
              {result.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando postulación..." : "Enviar postulación"}
      </Button>
    </form>
  );
}
