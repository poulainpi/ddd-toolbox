import { HTMLContainer, TLBaseShape, Editor } from 'tldraw'
import { useDisclosure } from '@ddd-toolbox/util'
import { useEffect, JSX } from 'react'
import { AbstractSectionShapeUtil, TLSectionBaseProps } from './abstract-section-shape-util'

export interface ClassificationCategory<T extends string = string> {
  key: string
  customKey: string
  label: string
  multiSelect: boolean
  options: readonly T[]
  labels: Record<T, string>
  descriptions: Record<T, string>
}

export type ClassificationValues = Record<string, string | string[] | undefined>

export type TLClassificationSectionProps<Values extends ClassificationValues> = TLSectionBaseProps & {
  values: Values
}

export interface ClassificationDialogProps<Values extends ClassificationValues> {
  disclosure: ReturnType<typeof useDisclosure> & { setIsOpen: (open: boolean) => void }
  initialValues: Values
  onSave: (values: Values) => void
}

export abstract class AbstractClassificationSectionShapeUtil<
  Type extends string,
  Values extends ClassificationValues,
> extends AbstractSectionShapeUtil<Type, TLClassificationSectionProps<Values>> {
  abstract getSectionTitle(): string
  abstract getCategories(): ClassificationCategory[]
  abstract renderDialog(props: ClassificationDialogProps<Values>): JSX.Element
  abstract getDefaultValues(): Values

  override getDefaultProps(): TLClassificationSectionProps<Values> {
    return {
      height: this.getDefaultHeight(),
      values: this.getDefaultValues(),
    }
  }

  protected getDisplayValue(
    value: string | string[] | undefined,
    customValue: string | string[] | undefined,
    labels: Record<string, string>,
    multiSelect: boolean,
  ): string {
    if (!value) return ''

    if (multiSelect) {
      const values = Array.isArray(value) ? value : [value]
      return values
        .map((v) => {
          if (v === 'other' && customValue) {
            return Array.isArray(customValue) ? customValue.join(', ') : customValue
          }
          return labels[v] || v
        })
        .join(', ')
    }

    if (value === 'other' && customValue) {
      return Array.isArray(customValue) ? customValue.join(', ') : customValue
    }
    return labels[value as string] || (value as string)
  }

  renderCategoryColumn(
    category: ClassificationCategory,
    value: string | string[] | undefined,
    customValue: string | string[] | undefined,
  ) {
    const displayValue = this.getDisplayValue(value, customValue, category.labels, category.multiSelect)
    const hasValue = displayValue !== ''

    return (
      <div key={category.key} className={`flex-1 text-center ${hasValue ? 'flex flex-col justify-center' : ''}`}>
        <div className="text-muted-foreground mb-1 text-sm font-semibold">{category.label}</div>
        {hasValue ? (
          <div className="text-foreground text-base">{displayValue}</div>
        ) : (
          <div className="text-muted-foreground space-y-0.5 text-xs">
            {category.options.slice(0, 4).map((option) => (
              <div key={option}>- {category.labels[option]}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  override component(shape: TLBaseShape<Type, TLClassificationSectionProps<Values>>) {
    const isEditing = this.editor.getEditingShapeId() === shape.id
    return <ClassificationComponent shape={shape} editor={this.editor} isEditing={isEditing} util={this} />
  }
}

function ClassificationComponent<Type extends string, Values extends ClassificationValues>({
  shape,
  editor,
  isEditing,
  util,
}: {
  shape: TLBaseShape<Type, TLClassificationSectionProps<Values>>
  editor: Editor
  isEditing: boolean
  util: AbstractClassificationSectionShapeUtil<Type, Values>
}) {
  const width = util.getWidth()
  const height = shape.props.height
  const borderClasses = util.getBorderClasses()
  const roundedClasses = util.getRoundedClasses()
  const categories = util.getCategories()
  const sectionTitle = util.getSectionTitle()

  const disclosure = useDisclosure()

  useEffect(() => {
    if (isEditing) {
      disclosure.open()
    }
  }, [isEditing, disclosure])

  const handleSave = (values: Values) => {
    editor.updateShape({
      ...shape,
      props: { ...shape.props, values },
    })
    editor.setEditingShape(null)
  }

  const handleOpenChange = (open: boolean) => {
    disclosure.setIsOpen(open)
    if (!open) {
      editor.setEditingShape(null)
    }
  }

  return (
    <HTMLContainer
      id={shape.id}
      className="bg-background [&_*]:!caret-foreground [&_*]:!cursor-[inherit]"
      onPointerDown={isEditing ? editor.markEventAsHandled : undefined}
      style={{
        pointerEvents: 'all',
        width,
        height,
      }}
    >
      <div className={`border-foreground flex h-full flex-col p-4 ${borderClasses} ${roundedClasses}`}>
        <div className="text-muted-foreground font-draw mb-2 text-base font-semibold">{sectionTitle}</div>
        <div className="font-draw flex flex-1 flex-row gap-4">
          {categories.map((category) => {
            const value = shape.props.values[category.key]
            const customValue = shape.props.values[category.customKey]
            return util.renderCategoryColumn(category, value, customValue)
          })}
        </div>
      </div>
      {util.renderDialog({
        disclosure: { ...disclosure, setIsOpen: handleOpenChange },
        initialValues: shape.props.values,
        onSave: handleSave,
      })}
    </HTMLContainer>
  )
}
