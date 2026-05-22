"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type LandingCampaign = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  logoAlt: string;
};

export type LandingJobPosition = {
  id: string;
  name: string;
};

export type LandingNewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
};

export type LandingLocation = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
};

export type LandingLegalText = {
  id: string;
  key: string;
  title: string;
  content: string;
};

export type LandingBanner = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  imageAlt: string;
};

export type PublicContactInfo = {
  phone: string;
  email: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
};

export type ActionState = {
  ok: boolean;
  message: string;
};

const consentText =
  "Autorizo a Smart Global Sales a tratar mis datos personales para fines de contacto, evaluación, postulación, gestión comercial y procesos relacionados.";

const requiredText = z.string().trim().min(1, "Este campo es obligatorio.");

const applicationSchema = z.object({
  documentType: requiredText,
  documentNumber: requiredText.min(6, "Ingresa un documento válido."),
  firstNames: requiredText.min(2, "Ingresa tus nombres."),
  lastNames: z.string().trim().optional(),
  phone: requiredText.min(9, "Ingresa un celular válido."),
  campaignId: requiredText,
  locationId: requiredText,
  consentAccepted: z.boolean().refine(Boolean, {
    message: "Debes aceptar el tratamiento de datos personales.",
  }),
});

const contactSchema = z.object({
  fullName: requiredText.min(2, "Ingresa tu nombre."),
  email: requiredText.email("Ingresa un correo válido."),
  phone: requiredText.min(9, "Ingresa un celular válido."),
  discoverySource: requiredText,
  message: requiredText.min(10, "Cuéntanos un poco más."),
  consentAccepted: z.boolean().refine(Boolean, {
    message: "Debes aceptar el tratamiento de datos personales.",
  }),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ContactInput = z.input<typeof contactSchema>;

export async function getActiveCampaigns(): Promise<LandingCampaign[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,slug,logo_path,logo_alt")
    .eq("is_active", true)
    .eq("show_in_marquee", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getActiveCampaigns", error);
    return [];
  }

  return (data ?? []).map((campaign) => {
    const logoUrl = campaign.logo_path
      ? supabase.storage.from("campaign-logos").getPublicUrl(campaign.logo_path).data.publicUrl
      : null;

    return {
      id: campaign.id,
      name: campaign.name,
      slug: campaign.slug,
      logoUrl,
      logoAlt: campaign.logo_alt ?? `Logo de ${campaign.name}`,
    };
  });
}

export async function getActiveLocations(): Promise<LandingLocation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,slug,city")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getActiveLocations", error);
    return [];
  }

  return data ?? [];
}

export async function getActiveJobPositions(): Promise<LandingJobPosition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_positions")
    .select("id,name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getActiveJobPositions", error);
    return [];
  }

  return data ?? [];
}

export async function getActiveLegalTexts(): Promise<LandingLegalText[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legal_contents")
    .select("id,key,title,content")
    .eq("is_active", true)
    .order("key", { ascending: true });

  if (error) {
    console.error("getActiveLegalTexts", error);
    return [];
  }

  return data ?? [];
}

export async function getActiveBanners(): Promise<LandingBanner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_banners")
    .select("id,title,description,image_path,image_alt")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  if (error) {
    console.error("getActiveBanners", error);
    return [];
  }

  return (data ?? []).map((banner) => ({
    id: banner.id,
    title: banner.title,
    description: banner.description,
    imageUrl: supabase.storage.from("site-banners").getPublicUrl(banner.image_path).data.publicUrl,
    imageAlt: banner.image_alt ?? banner.title,
  }));
}

export async function getPublicContactInfo(): Promise<PublicContactInfo> {
  const fallback = {
    phone: "+51 000 000 000",
    email: "contacto@smartglobalsales.com",
    facebook: "#",
    linkedin: "#",
    tiktok: "#",
  };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public_contact_info")
    .maybeSingle();

  if (error || !data?.value || typeof data.value !== "object") {
    if (error) console.error("getPublicContactInfo", error);
    return fallback;
  }

  const value = data.value as Partial<PublicContactInfo>;
  return {
    phone: value.phone || fallback.phone,
    email: value.email || fallback.email,
    facebook: value.facebook || fallback.facebook,
    linkedin: value.linkedin || fallback.linkedin,
    tiktok: value.tiktok || fallback.tiktok,
  };
}

export async function getPublicServicesText(): Promise<string> {
  const fallback =
    "En Smart Global Sales impulsamos el desarrollo del talento humano y la excelencia operativa. Ofrecemos programas de capacitación personalizados para potenciar las habilidades de cada colaborador, promovemos equipos de trabajo eficientes y colaborativos, y brindamos consultoría estratégica para mejorar el rendimiento organizacional. Nos enfocamos en soluciones innovadoras que transforman el potencial de las personas y empresas, ayudándolas a alcanzar sus objetivos de negocio.";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public_services_text")
    .maybeSingle();

  if (error) {
    console.error("getPublicServicesText", error);
    return fallback;
  }

  return typeof data?.value === "string" ? data.value : fallback;
}

export async function getActiveNewsArticles(): Promise<LandingNewsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_articles")
    .select("id,title,excerpt,content,image_path,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("getActiveNewsArticles", error);
    return [];
  }

  return (data ?? []).map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    imageUrl: article.image_path
      ? supabase.storage.from("news-images").getPublicUrl(article.image_path).data.publicUrl
      : null,
    createdAt: article.created_at,
  }));
}

export async function submitApplication(input: ApplicationInput): Promise<ActionState> {
  const parsed = applicationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }

  const supabase = await createClient();
  const { data: jobPosition } = await supabase
    .from("job_positions")
    .select("name")
    .eq("id", parsed.data.campaignId)
    .maybeSingle();
  const { data: location } = await supabase
    .from("locations")
    .select("name")
    .eq("id", parsed.data.locationId)
    .maybeSingle();

  const { error } = await supabase.from("application_leads").insert({
    document_type: parsed.data.documentType,
    document_number: parsed.data.documentNumber,
    first_names: parsed.data.firstNames,
    last_names: parsed.data.lastNames || null,
    phone: parsed.data.phone,
    campaign_id: parsed.data.campaignId,
    campaign_name_snapshot: jobPosition?.name ?? null,
    location_id: parsed.data.locationId,
    location_name_snapshot: location?.name ?? null,
    consent_accepted: true,
    consent_accepted_at: new Date().toISOString(),
    consent_text_snapshot: consentText,
  });

  if (error) {
    console.error("submitApplication", error);
    return {
      ok: false,
      message: "No pudimos registrar tu postulación. Inténtalo nuevamente.",
    };
  }

  return { ok: true, message: "Postulación enviada. Te contactaremos pronto." };
}

export async function submitContact(input: ContactInput): Promise<ActionState> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_leads").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    discovery_source: parsed.data.discoverySource,
    message: parsed.data.message,
    consent_accepted: true,
    consent_accepted_at: new Date().toISOString(),
    consent_text_snapshot: consentText,
  });

  if (error) {
    console.error("submitContact", error);
    return {
      ok: false,
      message: "No pudimos enviar tu mensaje. Inténtalo nuevamente.",
    };
  }

  return { ok: true, message: "Mensaje enviado correctamente." };
}
