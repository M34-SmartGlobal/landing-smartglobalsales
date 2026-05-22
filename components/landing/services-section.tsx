import { GraduationCap, Handshake, TrendingUp } from "lucide-react";

type ServicesSectionProps = {
  text: string;
};

const serviceHighlights = [
  { icon: GraduationCap, title: "Capacitación" },
  { icon: Handshake, title: "Equipos eficientes" },
  { icon: TrendingUp, title: "Consultoría estratégica" },
];

export function ServicesSection({ text }: ServicesSectionProps) {
  return (
    <section id="servicios" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Servicios</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-brand-black sm:text-5xl">
            Nuestros Servicios
          </h2>
          <p className="mt-6 text-lg leading-8 text-brand-muted">{text}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {serviceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-xl shadow-black/5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-red-soft text-brand-red">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-black text-brand-black">{item.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
