import { AboutSection } from "@/components/landing/about-section";
import { CampaignMarquee } from "@/components/landing/campaign-marquee";
import { ContactForm } from "@/components/landing/contact-form";
import { FooterLegal } from "@/components/landing/footer-legal";
import { HeroSection } from "@/components/landing/hero-section";
import { NewsSection } from "@/components/landing/news-section";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteHeader } from "@/components/landing/site-header";
import { PageTransition } from "@/components/page-transition";
import {
  getActiveBanners,
  getActiveCampaigns,
  getActiveJobPositions,
  getActiveLegalTexts,
  getActiveLocations,
  getActiveNewsArticles,
  getPublicContactInfo,
  getPublicServicesText,
} from "@/lib/actions/landing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [campaigns, locations, legalTexts, banners, contactInfo, jobPositions, servicesText, newsArticles] = await Promise.all([
    getActiveCampaigns(),
    getActiveLocations(),
    getActiveLegalTexts(),
    getActiveBanners(),
    getPublicContactInfo(),
    getActiveJobPositions(),
    getPublicServicesText(),
    getActiveNewsArticles(),
  ]);

  return (
    <main className="min-h-screen bg-white text-brand-graphite">
      <SiteHeader contactInfo={contactInfo} />
      <PageTransition>
        <HeroSection jobPositions={jobPositions} locations={locations} />
        <AboutSection banners={banners} />
        <ServicesSection text={servicesText} />
        <NewsSection articles={newsArticles} />
        <CampaignMarquee campaigns={campaigns} />
        <ContactForm />
        <FooterLegal legalTexts={legalTexts} />
      </PageTransition>
    </main>
  );
}
