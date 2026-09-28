import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ambasciata di Mare | Ristorante e Pizzeria a Rimini",
  description: "Il mare nel piatto, Rimini nel cuore. Scopri Ambasciata di Mare in Viale Regina Margherita 57: cucina di mare, pizza e momenti da condividere. Richiedi un tavolo online.",
  openGraph: { title: "Ambasciata di Mare | Rimini", description: "Il mare, a tavola. Ristorante e pizzeria a Rimini.", type: "website", images: ["/images/hero-seafood.jpg"] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="it"><body>{children}</body></html>;
}
