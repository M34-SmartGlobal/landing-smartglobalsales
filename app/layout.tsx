import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Smart Global Sales | Únete a nuestro equipo",
    template: "%s | Smart Global Sales",
  },
  description:
    "Postula a Smart Global Sales y conecta con oportunidades laborales en campañas comerciales de alto crecimiento.",
  applicationName: "Smart Global Sales",
  metadataBase: new URL("https://smartglobalsales.com"),
  openGraph: {
    title: "Smart Global Sales | Únete a nuestro equipo",
    description:
      "Landing de postulaciones y gestión de leads para Smart Global Sales.",
    siteName: "Smart Global Sales",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
