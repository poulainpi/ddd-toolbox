export enum DomainType {
  CORE = 'core',
  SUPPORTING = 'supporting',
  GENERIC = 'generic',
  OTHER = 'other',
}

export enum BusinessModelType {
  REVENUE = 'revenue',
  ENGAGEMENT = 'engagement',
  COMPLIANCE = 'compliance',
  COST_REDUCTION = 'cost-reduction',
  OTHER = 'other',
}

export enum EvolutionType {
  GENESIS = 'genesis',
  CUSTOM_BUILT = 'custom-built',
  PRODUCT = 'product',
  COMMODITY = 'commodity',
  OTHER = 'other',
}

export const DOMAIN_LABELS: Record<DomainType, string> = {
  [DomainType.CORE]: 'Core',
  [DomainType.SUPPORTING]: 'Supporting',
  [DomainType.GENERIC]: 'Generic',
  [DomainType.OTHER]: 'Other',
}

export const BUSINESS_MODEL_LABELS: Record<BusinessModelType, string> = {
  [BusinessModelType.REVENUE]: 'Revenue',
  [BusinessModelType.ENGAGEMENT]: 'Engagement',
  [BusinessModelType.COMPLIANCE]: 'Compliance',
  [BusinessModelType.COST_REDUCTION]: 'Cost Reduction',
  [BusinessModelType.OTHER]: 'Other',
}

export const EVOLUTION_LABELS: Record<EvolutionType, string> = {
  [EvolutionType.GENESIS]: 'Genesis',
  [EvolutionType.CUSTOM_BUILT]: 'Custom Built',
  [EvolutionType.PRODUCT]: 'Product',
  [EvolutionType.COMMODITY]: 'Commodity',
  [EvolutionType.OTHER]: 'Other',
}

export const DOMAIN_DESCRIPTIONS: Record<DomainType, string> = {
  [DomainType.CORE]: 'Key strategic differentiator that provides competitive advantage',
  [DomainType.SUPPORTING]: 'Necessary for the business but not a differentiator',
  [DomainType.GENERIC]: 'Common capability that can be outsourced or bought',
  [DomainType.OTHER]: 'Custom classification',
}

export const BUSINESS_MODEL_DESCRIPTIONS: Record<BusinessModelType, string> = {
  [BusinessModelType.REVENUE]: 'Directly generates income and revenue',
  [BusinessModelType.ENGAGEMENT]: 'Increases user engagement and retention',
  [BusinessModelType.COMPLIANCE]: 'Meets regulatory or compliance requirements',
  [BusinessModelType.COST_REDUCTION]: 'Reduces operational costs and improves efficiency',
  [BusinessModelType.OTHER]: 'Custom classification',
}

export const EVOLUTION_DESCRIPTIONS: Record<EvolutionType, string> = {
  [EvolutionType.GENESIS]: 'Novel and innovative, not well understood, high uncertainty',
  [EvolutionType.CUSTOM_BUILT]: 'Custom-built solution tailored to specific needs',
  [EvolutionType.PRODUCT]: 'Off-the-shelf product with good understanding',
  [EvolutionType.COMMODITY]: 'Standardized, well-understood, and widely available',
  [EvolutionType.OTHER]: 'Custom classification',
}
