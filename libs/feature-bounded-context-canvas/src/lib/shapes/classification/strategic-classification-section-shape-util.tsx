import { RecordProps, T, TLBaseShape } from 'tldraw'
import { SECOND_ROW_HEIGHT } from '../../constants'
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
} from '../../types/strategic-classification-types'
import { ClassificationDialog } from '../../dialogs/classification-dialog'
import {
  AbstractClassificationSectionShapeUtil,
  ClassificationDialogProps,
  ClassificationValues,
  TLClassificationSectionProps,
} from './abstract-classification-section-shape-util'
import { STRATEGIC_CLASSIFICATION_WIDTH } from '../../constants'

export type StrategicClassificationValues = ClassificationValues & {
  domain?: DomainType
  customDomain?: string
  businessModel?: BusinessModelType
  customBusinessModel?: string
  evolution?: EvolutionType
  customEvolution?: string
}

export type TLStrategicClassificationShape = TLBaseShape<
  'strategic-classification',
  TLClassificationSectionProps<StrategicClassificationValues>
>

const SECTION_WIDTH = STRATEGIC_CLASSIFICATION_WIDTH

export class StrategicClassificationShapeUtil extends AbstractClassificationSectionShapeUtil<
  'strategic-classification',
  StrategicClassificationValues
> {
  static override type = 'strategic-classification' as const
  static readonly WIDTH = SECTION_WIDTH

  static override props: RecordProps<TLStrategicClassificationShape> = {
    height: T.number,
    values: T.object({
      domain: T.literalEnum(...Object.values(DomainType)).optional(),
      customDomain: T.string.optional(),
      businessModel: T.literalEnum(...Object.values(BusinessModelType)).optional(),
      customBusinessModel: T.string.optional(),
      evolution: T.literalEnum(...Object.values(EvolutionType)).optional(),
      customEvolution: T.string.optional(),
    }),
  }

  override getDefaultValues(): StrategicClassificationValues {
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

  override getDefaultHeight(): number {
    return SECOND_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 1
  }

  override getBorderClasses(): string {
    return 'border-b-2 border-x-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }

  override renderDialog(props: ClassificationDialogProps<StrategicClassificationValues>) {
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
