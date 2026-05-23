"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { submitContact } from "@/lib/actions/landing";
import { cn } from "@/lib/utils/cn";

const schema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z.string().min(9, "Ingresa un celular válido."),
  discoverySource: z.string().min(1, "Selecciona una opción."),
  message: z.string().min(10, "Cuéntanos un poco más."),
  consentAccepted: z.boolean().refine(Boolean, {
    message: "Debes aceptar el tratamiento de datos personales.",
  }),
});

type ContactFormData = z.infer<typeof schema>;

const discoverySources = [
  "Facebook",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Google",
  "Referido",
  "Feria laboral",
  "Otro",
].map((source) => ({ label: source, value: source }));

export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      discoverySource: "",
      message: "",
      consentAccepted: false,
    },
  });

  async function onSubmit(values: ContactFormData) {
    setResult(null);
    const response = await submitContact(values);
    setResult(response);

    if (response.ok) {
      reset();
    }
  }

  return (
    <section id="contacto" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-brand-line bg-white p-5 text-slate-800 shadow-2xl shadow-black/5 sm:p-8 lg:p-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Contacto</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">Hablemos de oportunidades.</h2>
          <p className="mt-4 text-slate-600">
            Escríbenos si deseas más información sobre Smart Global Sales o nuestras campañas.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Nombres"
            placeholder="Tu nombre completo"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label="Correo"
            placeholder="correo@ejemplo.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Celular"
            placeholder="Ej. 987654321"
            inputMode="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Select
            label="¿Cómo ha llegado a saber de Smart Global Sales?"
            options={discoverySources}
            error={errors.discoverySource?.message}
            {...register("discoverySource")}
          />
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="message" className="text-sm font-semibold text-current">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Cuéntanos cómo podemos ayudarte"
              aria-invalid={Boolean(errors.message)}
              className={cn(
                "w-full resize-none rounded-2xl border border-white/15 bg-white px-4 py-3 text-sm text-brand-graphite shadow-sm outline-none transition duration-200 placeholder:text-brand-muted/70 focus:border-brand-red focus:ring-4 focus:ring-brand-red/20",
                errors.message && "border-brand-red",
              )}
              {...register("message")}
            />
            {errors.message ? <p className="text-sm text-red-200">{errors.message.message}</p> : null}
          </div>

          <label className="flex gap-3 rounded-2xl bg-brand-red-soft p-4 text-sm leading-6 text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-brand-line accent-brand-red"
              {...register("consentAccepted")}
            />
            <span>
              Acepto el tratamiento de mis datos personales para fines de contacto y gestión comercial.
              {errors.consentAccepted ? (
                <strong className="mt-1 block font-semibold text-brand-red">
                  {errors.consentAccepted.message}
                </strong>
              ) : null}
            </span>
          </label>

          {result ? (
            <p className={result.ok ? "text-sm font-semibold text-green-700 sm:col-span-2" : "text-sm font-semibold text-brand-red sm:col-span-2"}>
              {result.message}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="sm:col-span-2" disabled={isSubmitting}>
            {isSubmitting ? "Enviando mensaje..." : "Enviar mensaje"}
          </Button>
        </form>
      </div>
    </section>
  );
}
