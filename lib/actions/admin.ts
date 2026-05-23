"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

export type ApplicationLeadRow = {
  id: string;
  created_at: string;
  document_type: string;
  document_number: string;
  first_names: string;
  last_names: string | null;
  phone: string;
  campaign_name_snapshot: string | null;
  location_name_snapshot: string | null;
  status: string;
};

export type ContactLeadRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  discovery_source: string;
  message: string;
  status: string;
};

export type AdminCampaignRow = {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  logo_alt: string | null;
  is_active: boolean;
  show_in_marquee: boolean;
  sort_order: number;
  created_at: string;
  logo_url: string | null;
};

export type LegalContentRow = {
  id: string;
  key: string;
  title: string;
  content: string;
  is_active: boolean;
};

export type AdminBannerRow = {
  id: string;
  title: string;
  description: string | null;
  image_path: string;
  image_alt: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  image_url: string;
};

export type SiteSettingRow = {
  key: string;
  value: Record<string, string>;
};

export async function requireAdminUser(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  return { id: user.id, email: user.email };
}

export async function getAdminLeads() {
  await requireAdminUser();
  const supabase = await createClient();

  const [applications, contacts] = await Promise.all([
    supabase
      .from("application_leads")
      .select(
        "id,created_at,document_type,document_number,first_names,last_names,phone,campaign_name_snapshot,location_name_snapshot,status",
      )
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("contact_leads")
      .select("id,created_at,full_name,email,phone,discovery_source,message,status")
      .order("created_at", { ascending: false })
      .limit(300),
  ]);

  if (applications.error) {
    console.error("getAdminLeads applications", applications.error);
  }

  if (contacts.error) {
    console.error("getAdminLeads contacts", contacts.error);
  }

  return {
    applications: (applications.data ?? []) as ApplicationLeadRow[],
    contacts: (contacts.data ?? []) as ContactLeadRow[],
  };
}

export async function getAdminCampaigns(): Promise<AdminCampaignRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,slug,logo_path,logo_alt,is_active,show_in_marquee,sort_order,created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminCampaigns", error);
    return [];
  }

  return (data ?? []).map((campaign) => ({
    ...campaign,
    logo_url: campaign.logo_path
      ? supabase.storage.from("campaign-logos").getPublicUrl(campaign.logo_path).data.publicUrl
      : null,
  })) as AdminCampaignRow[];
}

export async function getAdminLegalContents(): Promise<LegalContentRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legal_contents")
    .select("id,key,title,content,is_active")
    .order("key", { ascending: true });

  if (error) {
    console.error("getAdminLegalContents", error);
    return [];
  }

  return (data ?? []) as LegalContentRow[];
}

export async function getAdminBanners(): Promise<AdminBannerRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_banners")
    .select("id,title,description,image_path,image_alt,is_active,sort_order,created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminBanners", error);
    return [];
  }

  return (data ?? []).map((banner) => ({
    ...banner,
    image_url: supabase.storage.from("site-banners").getPublicUrl(banner.image_path).data.publicUrl,
  })) as AdminBannerRow[];
}

export async function getPublicContactSetting(): Promise<SiteSettingRow> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key,value")
    .eq("key", "public_contact_info")
    .maybeSingle();

  if (error) {
    console.error("getPublicContactSetting", error);
  }

  return {
    key: "public_contact_info",
    value: {
      phone: data?.value?.phone ?? "+51 000 000 000",
      email: data?.value?.email ?? "contacto@smartglobalsales.com",
      facebook: data?.value?.facebook ?? "#",
      instagram: data?.value?.instagram ?? "#",
      linkedin: data?.value?.linkedin ?? "#",
      tiktok: data?.value?.tiktok ?? "#",
    },
  };
}

export async function getPublicServicesSetting(): Promise<string> {
  await requireAdminUser();
  const fallback =
    "En Smart Global Sales impulsamos el desarrollo del talento humano y la excelencia operativa. Ofrecemos programas de capacitación personalizados para potenciar las habilidades de cada colaborador, promovemos equipos de trabajo eficientes y colaborativos, y brindamos consultoría estratégica para mejorar el rendimiento organizacional. Nos enfocamos en soluciones innovadoras que transforman el potencial de las personas y empresas, ayudándolas a alcanzar sus objetivos de negocio.";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public_services_text")
    .maybeSingle();

  if (error) {
    console.error("getPublicServicesSetting", error);
    return fallback;
  }

  return typeof data?.value === "string" ? data.value : fallback;
}

export type AdminLocationRow = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AdminJobPositionRow = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
};

export type AdminNewsArticleRow = {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  image_path: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getAdminLocations(): Promise<AdminLocationRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,slug,address,city,is_active,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getAdminLocations", error);
    return [];
  }

  return (data ?? []) as AdminLocationRow[];
}

export async function getAdminJobPositions(): Promise<AdminJobPositionRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_positions")
    .select("id,name,is_active,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getAdminJobPositions", error);
    return [];
  }

  return (data ?? []) as AdminJobPositionRow[];
}

export async function getAdminNewsArticles(): Promise<AdminNewsArticleRow[]> {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_articles")
    .select("id,title,excerpt,content,image_path,is_active,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminNewsArticles", error);
    return [];
  }

  return (data ?? []).map((article) => ({
    ...article,
    image_url: article.image_path
      ? supabase.storage.from("news-images").getPublicUrl(article.image_path).data.publicUrl
      : null,
  })) as AdminNewsArticleRow[];
}
