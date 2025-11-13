export interface BrandSnapshot {
  whatTheyDo: string;
  category: string;
  primaryOfferings: string[];
  targetSegments: string[];
  brandVoice: string;
  visibilityOpportunities: string[];
}

export interface SalesStarterKit {
  buyerRoles: string[];
  painPoints: string[];
  valueAngles: string[];
  coldEmailOpener: string;
  linkedInDMMessage: string;
  discoveryQuestions: string[];
  thoughtLeadershipPoint: string;
}

export interface GenerateResponse {
  brandSnapshot: BrandSnapshot;
  salesStarterKit: SalesStarterKit;
}

