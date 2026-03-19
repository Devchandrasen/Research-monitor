export interface CountryData {
  id: string;
  code: string;
  name: string;
  region?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  researchOutput: number;
  phdPositions: number;
  postdocPositions: number;
  fundingAvailable: number;
  rInvestment: number;
}

export interface ResearchField {
  id: string;
  name: string;
  category: string;
  description?: string;
  projectCount?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'phd' | 'postdoc' | 'researcher' | 'faculty';
  description?: string;
  institution?: string;
  deadline?: string;
  salary?: number;
  currency?: string;
  url?: string;
  country?: CountryData;
}

export interface FundingCall {
  id: string;
  title: string;
  funder?: string;
  description?: string;
  deadline?: string;
  amount?: number;
  currency?: string;
  url?: string;
  focusArea?: string;
  country?: CountryData;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'recruiting';
  institution?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  field?: ResearchField;
  country?: CountryData;
}

export interface ResearchMetric {
  id: string;
  metricType: 'publications' | 'citations' | 'patents' | 'grants';
  value: number;
  period: string;
}

export interface GlobalStats {
  totalProjects: number;
  totalPhdPositions: number;
  totalPostdocPositions: number;
  totalFunding: number;
  topCountries: CountryData[];
  topFields: ResearchField[];
}

export interface SearchFilters {
  country?: string;
  field?: string;
  type?: string;
  status?: string;
}

export type MapViewMode = 'research' | 'phd' | 'postdoc' | 'funding';

export interface MapMarker {
  coordinates: [number, number];
  value: number;
  country: string;
  countryCode: string;
}
