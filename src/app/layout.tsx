import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";
import { OrganizationSchema } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://somosdaris.com'),
  title: {
    default: "SomosDaris - Servicio de Limpieza en Valledupar",
    template: "%s | SomosDaris"
  },
  description: "Servicio profesional de limpieza en Valledupar, Cesar. Limpieza de casas, oficinas y espacios comerciales. Reserva fácil y rápido con paquetes por horas.",
  keywords: ["limpieza", "Valledupar", "Cesar", "servicio de limpieza", "limpieza profesional", "limpieza de casas", "limpieza de oficinas"],
  authors: [{ name: "SomosDaris" }],
  creator: "SomosDaris",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://somosdaris.com",
    siteName: "SomosDaris",
    title: "SomosDaris - Servicio de Limpieza en Valledupar",
    description: "Servicio profesional de limpieza en Valledupar, Cesar. Reserva fácil y rápido con paquetes por horas.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SomosDaris - Servicio de Limpieza"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SomosDaris - Servicio de Limpieza en Valledupar",
    description: "Servicio profesional de limpieza en Valledupar, Cesar. Reserva fácil y rápido.",
    images: ["/images/twitter-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  verification: {
    google: "verification_token", // Reemplazar con el token real de Google Search Console
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationSchema />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
