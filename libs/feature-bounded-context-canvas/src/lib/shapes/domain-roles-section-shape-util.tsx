import { RecordProps, T, TLBaseShape } from 'tldraw'
import { DOMAIN_ROLE_DESCRIPTIONS, DOMAIN_ROLE_LABELS, DomainRoleType } from '../types/domain-roles-types'
import { ClassificationDialog } from '../dialogs/classification-dialog'
import {
  AbstractClassificationSectionShapeUtil,
  ClassificationDialogProps,
} from './abstract-classification-section-shape-util'

export type TLDomainRolesShape = TLBaseShape<
  'domain-roles',
  {
    roles?: DomainRoleType[]
    customRoles?: string
  }
>

const SECTION_WIDTH = 600
const SECTION_HEIGHT = 156

export class DomainRolesShapeUtil extends AbstractClassificationSectionShapeUtil<
  'domain-roles',
  {
    roles?: DomainRoleType[]
    customRoles?: string
  }
> {
  static override type = 'domain-roles' as const

  static override props: RecordProps<TLDomainRolesShape> = {
    roles: T.arrayOf(T.literalEnum(...Object.values(DomainRoleType))).optional(),
    customRoles: T.string.optional(),
  }

  override getDefaultProps(): TLDomainRolesShape['props'] {
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

  override renderDialog(props: ClassificationDialogProps<TLDomainRolesShape['props']>) {
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
