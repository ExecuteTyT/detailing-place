"use client";

import { createContext, useContext } from "react";
import type { NavItem, LiveStatusItem, SocialProofItem, SeasonalOfferData, CarClass } from "./types";

export interface SiteData {
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  address: string;
  hours: string;
  serviceNav: NavItem[];
  infoNav: NavItem[];
  liveStatus: LiveStatusItem[];
  socialProofItems: SocialProofItem[];
  seasonalOffer: SeasonalOfferData | null;
  quizCategories: string[];
  carClasses: CarClass[];
}

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({
  data,
  children,
}: {
  data: SiteData;
  children: React.ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteData {
  const data = useContext(SiteDataContext);
  if (!data) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return data;
}
