import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "App - SomosDaris",
    template: "%s | SomosDaris"
  },
  description: "Gestiona tus servicios de limpieza en Valledupar. Reserva, consulta historial y más.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <BottomNav />
    </>
  );
}
