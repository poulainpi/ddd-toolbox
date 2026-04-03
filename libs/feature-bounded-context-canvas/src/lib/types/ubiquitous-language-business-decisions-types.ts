import { TLSectionBaseProps } from '../shapes/abstract-section-shape-util'

export type UbiquitousLanguageTerm = {
  id: string
  term: string
  definition: string
}

export type BusinessDecision = {
  id: string
  description: string
}

export type UbiquitousLanguageBusinessDecisionsSectionProps = TLSectionBaseProps & {
  terms: UbiquitousLanguageTerm[]
  decisions: BusinessDecision[]
}
