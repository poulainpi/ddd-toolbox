import { RecordProps, T, TLBaseShape } from 'tldraw'
import {
  BUSINESS_MODEL_DESCRIPTIONS,
  BUSINESS_MODEL_LABELS,
  BusinessModelType,
  DOMAIN_DESCRIPTIONS,
  DOMAIN_LABELS,
  DomainType,
  EVOLUTION_DESCRIPTIONS,
  EVOLUTION_LABELS,
  EvolutionType,
} from '../types/strategic-classification-types'
import { ClassificationDialog } from '../dialogs/classification-dialog'
import {
  AbstractClassificationSectionShapeUtil,
  ClassificationDialogProps,
} from './abstract-classification-section-shape-util'

export type TLStrategicClassificationShape = TLBaseShape<
  'strategic-classification',
  {
    domain?: DomainType
    customDomain?: string
    businessModel?: BusinessModelType
    customBusinessModel?: string
    evolution?: EvolutionType
    customEvolution?: string
  }
>

const SECTION_WIDTH = 600
const SECTION_HEIGHT = 156

export class StrategicClassificationShapeUtil extends AbstractClassificationSectionShapeUtil<
  'strategic-classification',
  {
    domain?: DomainType
    customDomain?: string
    businessModel?: BusinessModelType
    customBusinessModel?: string
    evolution?: EvolutionType
    customEvolution?: string
  }
> {
  static override type = 'strategic-classification' as const
  static readonly WIDTH = SECTION_WIDTH
  static readonly HEIGHT = SECTION_HEIGHT

  static override props: RecordProps<TLStrategicClassificationShape> = {
    domain: T.literalEnum(...Object.values(DomainType)).optional(),
    customDomain: T.string.optional(),
    businessModel: T.literalEnum(...Object.values(BusinessModelType)).optional(),
    customBusinessModel: T.string.optional(),
    evolution: T.literalEnum(...Object.values(EvolutionType)).optional(),
    customEvolution: T.string.optional(),
  }

  override getDefaultProps(): TLStrategicClassificationShape['props'] {
    return {}
  }

  override getSectionTitle(): string {
    return 'Strategic Classification'
  }

  override getCategories() {
    return [
      {
        key: 'domain',
        customKey: 'customDomain',
        label: 'Domain',
        multiSelect: false,
        options: Object.values(DomainType),
        labels: DOMAIN_LABELS,
        descriptions: DOMAIN_DESCRIPTIONS,
      },
      {
        key: 'businessModel',
        customKey: 'customBusinessModel',
        label: 'Business Model',
        multiSelect: false,
        options: Object.values(BusinessModelType),
        labels: BUSINESS_MODEL_LABELS,
        descriptions: BUSINESS_MODEL_DESCRIPTIONS,
      },
      {
        key: 'evolution',
        customKey: 'customEvolution',
        label: 'Evolution',
        multiSelect: false,
        options: Object.values(EvolutionType),
        labels: EVOLUTION_LABELS,
        descriptions: EVOLUTION_DESCRIPTIONS,
      },
    ]
  }

  override getWidth(): number {
    return SECTION_WIDTH
  }

  override getHeight(): number {
    return SECTION_HEIGHT
  }

  override getBorderClasses(): string {
    return 'border-x-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }

  override renderDialog(props: ClassificationDialogProps<TLStrategicClassificationShape['props']>) {
    return (
      <ClassificationDialog
        title="Strategic Classification"
        description="Classify your bounded context to understand its strategic importance and evolution stage."
        categories={this.getCategories()}
        disclosure={props.disclosure}
        initialValues={props.initialValues}
        onSave={props.onSave}
      />
    )
  }
}
