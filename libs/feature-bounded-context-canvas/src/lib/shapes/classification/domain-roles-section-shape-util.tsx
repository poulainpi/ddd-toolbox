import { RecordProps, T, TLBaseShape } from 'tldraw'
import { SECOND_ROW_HEIGHT } from '../../constants'
import { DOMAIN_ROLE_DESCRIPTIONS, DOMAIN_ROLE_LABELS, DomainRoleType } from '../../types/domain-roles-types'
import { ClassificationDialog } from '../../dialogs/classification-dialog'
import {
  AbstractClassificationSectionShapeUtil,
  ClassificationDialogProps,
  ClassificationValues,
  TLClassificationSectionProps,
} from './abstract-classification-section-shape-util'
import { DOMAIN_ROLES_WIDTH } from '../../constants'

export type DomainRolesValues = ClassificationValues & {
  roles?: DomainRoleType[]
  customRoles?: string
}

export type TLDomainRolesShape = TLBaseShape<'domain-roles', TLClassificationSectionProps<DomainRolesValues>>

const SECTION_WIDTH = DOMAIN_ROLES_WIDTH

export class DomainRolesShapeUtil extends AbstractClassificationSectionShapeUtil<'domain-roles', DomainRolesValues> {
  static override type = 'domain-roles' as const

  static override props: RecordProps<TLDomainRolesShape> = {
    height: T.number,
    values: T.object({
      roles: T.arrayOf(T.literalEnum(...Object.values(DomainRoleType))).optional(),
      customRoles: T.string.optional(),
    }),
  }

  override getDefaultValues(): DomainRolesValues {
    return {}
  }

  override getSectionTitle(): string {
    return 'Domain Roles'
  }

  override getCategories() {
    return [
      {
        key: 'roles',
        customKey: 'customRoles',
        label: 'Role Types',
        multiSelect: true,
        options: Object.values(DomainRoleType),
        labels: DOMAIN_ROLE_LABELS,
        descriptions: DOMAIN_ROLE_DESCRIPTIONS,
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
    return 'border-r-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }

  override renderDialog(props: ClassificationDialogProps<DomainRolesValues>) {
    return (
      <ClassificationDialog
        title="Domain Roles"
        description="Select one or more role types for this bounded context."
        categories={this.getCategories()}
        disclosure={props.disclosure}
        initialValues={props.initialValues}
        onSave={props.onSave}
      />
    )
  }
}
