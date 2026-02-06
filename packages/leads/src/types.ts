export type Platform = "jeanbrun" | "stop-loyer";

export type LeadStatus = "new" | "dispatched" | "contacted" | "converted" | "lost";

export type PricingModel = "per_lead" | "commission" | "hybrid";

export interface LeadData {
  email: string;
  phone?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  platform: Platform;
  sourcePage?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  consentPromoter: boolean;
  consentBroker: boolean;
  consentNewsletter: boolean;
  consentDate: Date;
  simulationData: Record<string, unknown>;
}

export interface LeadScore {
  total: number;
  breakdown: {
    completeness: number;
    financialCapacity: number;
    projectMaturity: number;
    engagement: number;
  };
}

export interface PromoterData {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | undefined;
  pricingModel: PricingModel;
  pricePerLead?: number | undefined;
  commissionRate?: number | undefined;
  zones: string[];
  active: boolean;
}

export interface BrokerData {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | undefined;
  pricePerLead: number;
  zones: string[];
  active: boolean;
}
