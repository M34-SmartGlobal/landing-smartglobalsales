import Image from "next/image";

import type { LandingCampaign } from "@/lib/actions/landing";

type CampaignMarqueeProps = {
  campaigns: LandingCampaign[];
};

export function CampaignMarquee({ campaigns }: CampaignMarqueeProps) {
  const visibleCampaigns = campaigns.filter((campaign) => campaign.logoUrl || campaign.name);
  const repeatCount = visibleCampaigns.length <= 2 ? 5 : visibleCampaigns.length <= 4 ? 4 : 2;
  const marqueeItems = Array.from({ length: repeatCount }, () => visibleCampaigns).flat();

  if (visibleCampaigns.length === 0) {
    return null;
  }

  return (
    <section id="campanas" className="mt-20 bg-white py-12 text-brand-graphite sm:mt-24" aria-label="Campañas activas">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.3em] text-brand-black">
          Campañas activas
        </p>
        <div className="campaign-marquee-mask overflow-hidden">
          <div className="campaign-marquee-track flex w-max items-center gap-12 lg:gap-20">
            {marqueeItems.map((campaign, index) => (
              <div
                key={`${campaign.id}-${index}`}
                className="flex h-24 min-w-56 items-center justify-center bg-white px-10"
              >
                {campaign.logoUrl ? (
                  <Image
                    src={campaign.logoUrl}
                    alt={campaign.logoAlt}
                    width={160}
                    height={64}
                    className="max-h-14 w-auto object-contain"
                  />
                ) : (
                  <span className="text-lg font-black text-brand-red">{campaign.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
