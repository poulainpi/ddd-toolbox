import { HTMLContainer, TLBaseShape, Editor } from 'tldraw'
import { useDisclosure } from '@ddd-toolbox/util'
import { useEffect, JSX } from 'react'
import { AbstractSectionShapeUtil } from './abstract-section-shape-util'

export interface ClassificationCategory<T extends string = string> {
  key: string
  customKey: string
  label: string
  multiSelect: boolean
  options: readonly T[]
  labels: Record<T, string>
  descriptions: Record<T, string>
}

export interface ClassificationValues {
  [key: string]: string | string[] | undefined
}

export interface ClassificationDialogProps<Props extends ClassificationValues> {
  disclosure: ReturnType<typeof useDisclosure> & { setIsOpen: (open: boolean) => void }
  initialValues: Props
  onSave: (values: Props) => void
}

export abstract class AbstractClassificationSectionShapeUtil<
  Type extends string,
  Props extends ClassificationValues,
> extends AbstractSectionShapeUtil<Type, Props> {
  abstract getSectionTitle(): string
  abstract getCategories(): ClassificationCategory[]
  abstract renderDialog(props: ClassificationDialogProps<Props>): JSX.Element

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
      <div key={category.key} className={`text-center ${hasValue ? 'flex flex-col justify-center' : ''}`}>
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

  override component(shape: TLBaseShape<Type, Props>) {
    const isEditing = this.editor.getEditingShapeId() === shape.id
    return <ClassificationComponent shape={shape} editor={this.editor} isEditing={isEditing} util={this} />
  }
}

function ClassificationComponent<Type extends string, Props extends ClassificationValues>({
  shape,
  editor,
  isEditing,
  util,
}: {
  shape: TLBaseShape<Type, Props>
  editor: Editor
  isEditing: boolean
  util: AbstractClassificationSectionShapeUtil<Type, Props>
}) {
  const width = util.getWidth()
  const height = util.getHeight()
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

  const handleSave = (values: Props) => {
    editor.updateShape({
      ...shape,
      props: values,
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
        <div className={`font-draw grid flex-1 gap-4 grid-cols-${categories.length}`}>
          {categories.map((category) => {
            const value = shape.props[category.key]
            const customValue = shape.props[category.customKey]
            return util.renderCategoryColumn(category, value, customValue)
          })}
        </div>
      </div>
      {util.renderDialog({
        disclosure: { ...disclosure, setIsOpen: handleOpenChange },
        initialValues: shape.props,
        onSave: handleSave,
      })}
    </HTMLContainer>
  )
}
