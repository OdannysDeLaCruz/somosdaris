import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { OrganizationSchema } from "@/components/StructuredData";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

const bricolage = localFont({ 
  src: [
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/bricolage/BricolageGrotesque-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    }
  ],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://somosdaris.vercel.app'),
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
    url: "https://somosdaris.vercel.app",
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
        className={`${bricolage.variable} ${roboto.className} antialiased font-bricolage`}
      >
        <OrganizationSchema />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
