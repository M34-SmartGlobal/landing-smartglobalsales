import { SettingsManager } from "@/components/admin/settings-manager";
import { getPublicContactSetting, getPublicServicesSetting } from "@/lib/actions/admin";

export default async function AdminSettingsPage() {
  const [setting, servicesText] = await Promise.all([
    getPublicContactSetting(),
    getPublicServicesSetting(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Configuración global</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Settings & Contacto</h2>
        <p className="mt-2 text-brand-muted">
          Edita los datos públicos usados en la barra superior de la landing.
        </p>
      </div>
      <SettingsManager initialValue={setting.value} initialServicesText={servicesText} />
    </section>
  );
}
