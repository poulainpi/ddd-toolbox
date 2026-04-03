import { Editor, HTMLContainer, RecordProps, T, TLBaseShape } from 'tldraw'
import { useEffect, useRef, useState } from 'react'
import { useDisclosure } from '@ddd-toolbox/util'
import { AbstractSectionShapeUtil, TLSectionBaseProps } from './abstract-section-shape-util'
import { UbiquitousLanguageBusinessDecisionsDialog } from '../dialogs/ubiquitous-language-business-decisions-dialog'
import {
  BusinessDecision,
  UbiquitousLanguageTerm,
  UbiquitousLanguageBusinessDecisionsSectionProps,
} from '../types/ubiquitous-language-business-decisions-types'
import { COMMUNICATION_ROW_HEIGHT, UBIQUITOUS_LANGUAGE_BUSINESS_DECISIONS_WIDTH } from '../constants'

export type TLUbiquitousLanguageBusinessDecisionsShape = TLBaseShape<
  'ubiquitous-language-business-decisions-section',
  UbiquitousLanguageBusinessDecisionsSectionProps
>

export class UbiquitousLanguageBusinessDecisionsShapeUtil extends AbstractSectionShapeUtil<
  'ubiquitous-language-business-decisions-section',
  UbiquitousLanguageBusinessDecisionsSectionProps
> {
  static override type = 'ubiquitous-language-business-decisions-section' as const
  static readonly WIDTH = UBIQUITOUS_LANGUAGE_BUSINESS_DECISIONS_WIDTH

  static override props: RecordProps<TLBaseShape<string, TLSectionBaseProps>> = {
    height: T.number,
    terms: T.arrayOf(
      T.object({
        id: T.string,
        term: T.string,
        definition: T.string,
      }),
    ),
    decisions: T.arrayOf(
      T.object({
        id: T.string,
        description: T.string,
      }),
    ),
  } as unknown as RecordProps<TLBaseShape<string, TLSectionBaseProps>>

  override getWidth(): number {
    return UbiquitousLanguageBusinessDecisionsShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return COMMUNICATION_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 2
  }

  override getBorderClasses(): string {
    return 'border-l-2 border-r-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }

  override getDefaultProps(): UbiquitousLanguageBusinessDecisionsSectionProps {
    return {
      height: this.getDefaultHeight(),
      terms: [],
      decisions: [],
    }
  }

  override component(
    shape: TLBaseShape<
      'ubiquitous-language-business-decisions-section',
      UbiquitousLanguageBusinessDecisionsSectionProps
    >,
  ) {
    const width = this.getWidth()
    const borderClasses = this.getBorderClasses()
    const roundedClasses = this.getRoundedClasses()

    const isEditing = this.editor.getEditingShapeId() === shape.id

    return (
      <UbiquitousLanguageBusinessDecisionsSectionComponent
        shape={shape}
        editor={this.editor}
        isEditing={isEditing}
        width={width}
        borderClasses={borderClasses}
        roundedClasses={roundedClasses}
      />
    )
  }
}

function UbiquitousLanguageBusinessDecisionsSectionComponent({
  shape,
  editor,
  isEditing,
  width,
  borderClasses,
  roundedClasses,
}: {
  shape: TLBaseShape<'ubiquitous-language-business-decisions-section', UbiquitousLanguageBusinessDecisionsSectionProps>
  editor: Editor
  isEditing: boolean
  width: number
  borderClasses: string
  roundedClasses: string
}) {
  const disclosure = useDisclosure()
  const [initialTab, setInitialTab] = useState<'ubiquitous-language' | 'business-decisions'>('ubiquitous-language')
  const pendingTabRef = useRef<'ubiquitous-language' | 'business-decisions'>('ubiquitous-language')

  const terms = shape.props.terms
  const decisions = shape.props.decisions

  useEffect(() => {
    if (isEditing) {
      setInitialTab(pendingTabRef.current)
      disclosure.open()
    }
  }, [isEditing, disclosure])

  const handleSave = (updatedTerms: UbiquitousLanguageTerm[], updatedDecisions: BusinessDecision[]) => {
    editor.updateShape({
      ...shape,
      props: { ...shape.props, terms: updatedTerms, decisions: updatedDecisions },
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
      style={{ pointerEvents: 'all', width, height: shape.props.height }}
    >
      <div className={`border-foreground flex h-full flex-col ${borderClasses} ${roundedClasses}`}>
        <div
          className="flex min-h-0 flex-[3] flex-col overflow-hidden p-3"
          onPointerDown={() => {
            pendingTabRef.current = 'ubiquitous-language'
          }}
        >
          <div className="text-muted-foreground font-draw mb-0.5 text-center text-sm font-semibold">
            Ubiquitous Language
          </div>
          <div className="text-muted-foreground/60 font-draw mb-2 text-center text-xs">
            Context-specific domain terminology
          </div>
          {terms.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="border-muted-foreground/30 text-muted-foreground rounded-md border-2 border-dashed px-4 py-2 text-center text-xs">
                Double-click to add terms
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1.5 overflow-hidden">
              {terms.map((term) => (
                <div key={term.id} className="border-foreground/30 rounded border border-dashed p-1.5">
                  <div className="font-draw text-xs leading-tight font-semibold">{term.term}</div>
                  <div className="text-muted-foreground font-draw mt-0.5 text-xs leading-snug whitespace-pre-wrap">
                    {term.definition}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-foreground/20 border-t border-dashed" />

        <div
          className="flex min-h-0 flex-[2] flex-col overflow-hidden p-3"
          onPointerDown={() => {
            pendingTabRef.current = 'business-decisions'
          }}
        >
          <div className="text-muted-foreground font-draw mb-0.5 text-center text-sm font-semibold">
            Business Decisions
          </div>
          <div className="text-muted-foreground/60 font-draw mb-2 text-center text-xs">
            Key business rules, policies, and decisions
          </div>
          {decisions.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="border-muted-foreground/30 text-muted-foreground rounded-md border-2 border-dashed px-4 py-2 text-center text-xs">
                Double-click to add decisions
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="border-foreground/30 font-draw rounded border px-2 py-1 text-xs leading-snug whitespace-pre-wrap"
                >
                  {decision.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UbiquitousLanguageBusinessDecisionsDialog
        disclosure={{ ...disclosure, setIsOpen: handleOpenChange }}
        initialTerms={terms}
        initialDecisions={decisions}
        initialTab={initialTab}
        onSave={handleSave}
      />
    </HTMLContainer>
  )
}
