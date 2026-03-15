import { Editor, HTMLContainer, RecordProps, T, TLBaseShape } from 'tldraw'
import { useEffect } from 'react'
import { useDisclosure } from '@ddd-toolbox/util'
import { AbstractSectionShapeUtil, TLSectionBaseProps } from '../abstract-section-shape-util'
import { CommunicationDialog } from '../../dialogs/communication-dialog'
import {
  Communication,
  MessageType,
  RelationshipType,
  CommunicationSectionProps,
  COLLABORATOR_ICONS,
  MESSAGE_TYPE_COLORS,
} from '../../types/communication-types'

export type TLCommunicationSectionShape<Type extends string> = TLBaseShape<Type, CommunicationSectionProps>

export abstract class AbstractCommunicationSectionShapeUtil<Type extends string> extends AbstractSectionShapeUtil<
  Type,
  CommunicationSectionProps
> {
  static override props: RecordProps<TLBaseShape<string, TLSectionBaseProps>> = {
    height: T.number,
    communications: T.arrayOf(
      T.object({
        id: T.string,
        collaboratorName: T.string,
        collaboratorType: T.literalEnum('bounded-context', 'external-system', 'frontend', 'direct-user-interaction'),
        leftRelationshipType: T.optional(T.literalEnum('CF', 'OHS', 'ACL', 'PNR', 'SK', 'CUS', 'SUP')),
        rightRelationshipType: T.optional(T.literalEnum('CF', 'OHS', 'ACL', 'PNR', 'SK', 'CUS', 'SUP')),
        messages: T.arrayOf(
          T.object({
            id: T.string,
            label: T.string,
            type: T.literalEnum('command', 'event', 'query'),
          }),
        ),
      }),
    ),
  } as unknown as RecordProps<TLBaseShape<string, TLSectionBaseProps>>

  abstract getDirection(): 'inbound' | 'outbound'

  override getDefaultProps(): CommunicationSectionProps {
    return {
      height: this.getDefaultHeight(),
      communications: [],
    }
  }

  override getIndicatorRadius(): number {
    return 0
  }

  override component(shape: TLBaseShape<Type, CommunicationSectionProps>) {
    const isEditing = this.editor.getEditingShapeId() === shape.id
    const direction = this.getDirection()
    const width = this.getWidth()
    const borderClasses = this.getBorderClasses()
    const roundedClasses = this.getRoundedClasses()

    return (
      <CommunicationSectionComponent
        shape={shape}
        editor={this.editor}
        isEditing={isEditing}
        direction={direction}
        width={width}
        borderClasses={borderClasses}
        roundedClasses={roundedClasses}
        util={this}
      />
    )
  }
}

function RelationshipBadge({ type }: { type: RelationshipType | undefined }) {
  if (!type) return <div className="w-8 shrink-0" />
  return (
    <div className="bg-foreground text-background flex w-7 shrink-0 items-center justify-center self-stretch rounded font-mono text-sm font-bold">
      <span className="font-draw rotate-180 text-lg tracking-widest [writing-mode:vertical-rl]">{type}</span>
    </div>
  )
}

function MessageChip({ label, type }: { label: string; type: MessageType }) {
  return (
    <span
      className={`font-draw flex min-h-12 w-24 items-center justify-center rounded px-1.5 py-0.5 text-center text-xs font-medium ${MESSAGE_TYPE_COLORS[type]}`}
    >
      {label || type}
    </span>
  )
}

function CommunicationRow({
  communication,
  direction,
}: {
  communication: Communication
  direction: 'inbound' | 'outbound'
}) {
  const CollaboratorIcon = COLLABORATOR_ICONS[communication.collaboratorType]
  const collaborator = (
    <div className={`flex items-center gap-2 p-2 ${direction === 'outbound' ? 'flex-row-reverse' : ''}`}>
      <CollaboratorIcon className="text-muted-foreground h-10 w-10 shrink-0" />
      <span className="font-draw text-sm leading-tight font-medium">
        {communication.collaboratorName || '(unnamed)'}
      </span>
    </div>
  )
  const messages = (
    <div className="flex flex-1 flex-wrap content-center gap-2 p-2">
      {communication.messages.map((message) => (
        <MessageChip key={message.id} label={message.label} type={message.type} />
      ))}
    </div>
  )

  if (direction === 'inbound') {
    return (
      <div className="border-foreground/20 grid w-full grid-cols-[1fr_auto_2fr_auto] border-t border-dashed pt-2 pb-2 pl-2 [&:first-child]:border-t-0">
        {collaborator}
        <RelationshipBadge type={communication.leftRelationshipType} />
        {messages}
        <RelationshipBadge type={communication.rightRelationshipType} />
      </div>
    )
  }

  return (
    <div className="border-foreground/20 grid w-full grid-cols-[auto_2fr_auto_1fr] border-t border-dashed pt-2 pr-2 pb-2 [&:first-child]:border-t-0">
      <RelationshipBadge type={communication.leftRelationshipType} />
      {messages}
      <RelationshipBadge type={communication.rightRelationshipType} />
      {collaborator}
    </div>
  )
}

function CommunicationSectionComponent<Type extends string>({
  shape,
  editor,
  isEditing,
  direction,
  width,
  borderClasses,
  roundedClasses,
}: {
  shape: TLBaseShape<Type, CommunicationSectionProps>
  editor: Editor
  isEditing: boolean
  direction: 'inbound' | 'outbound'
  width: number
  borderClasses: string
  roundedClasses: string
  util: AbstractCommunicationSectionShapeUtil<Type>
}) {
  const disclosure = useDisclosure()
  const communications = shape.props.communications

  useEffect(() => {
    if (isEditing) {
      disclosure.open()
    }
  }, [isEditing, disclosure])

  const handleSave = (updated: Communication[]) => {
    editor.updateShape({
      ...shape,
      props: { ...shape.props, communications: updated },
    })
    editor.setEditingShape(null)
  }

  const handleOpenChange = (open: boolean) => {
    disclosure.setIsOpen(open)
    if (!open) {
      editor.setEditingShape(null)
    }
  }

  const sectionTitle = direction === 'inbound' ? 'Inbound Communication' : 'Outbound Communication'

  return (
    <HTMLContainer
      id={shape.id}
      className="bg-background [&_*]:!caret-foreground [&_*]:!cursor-[inherit]"
      onPointerDown={isEditing ? editor.markEventAsHandled : undefined}
      style={{ pointerEvents: 'all', width, height: shape.props.height }}
    >
      <div className={`border-foreground flex h-full flex-col ${borderClasses} ${roundedClasses}`}>
        <div className="text-muted-foreground font-draw mb-2 px-4 pt-3 text-base font-semibold">{sectionTitle}</div>

        {communications.length > 0 && (
          <div
            className={`text-muted-foreground/60 font-draw grid px-2 pb-1 text-xs font-medium ${
              direction === 'inbound' ? 'grid-cols-[1fr_auto_2fr_auto]' : 'grid-cols-[auto_2fr_auto_1fr]'
            }`}
          >
            {direction === 'inbound' ? (
              <>
                <span className="text-center">Collaborator</span>
                <span />
                <span className="text-center">Messages</span>
                <span />
              </>
            ) : (
              <>
                <span />
                <span className="text-center">Messages</span>
                <span />
                <span className="text-center">Collaborator</span>
              </>
            )}
          </div>
        )}

        {communications.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="border-muted-foreground/30 text-muted-foreground rounded-md border-2 border-dashed px-6 py-4 text-center text-sm">
              Double-click to add communications
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {communications.map((communication) => (
              <CommunicationRow key={communication.id} communication={communication} direction={direction} />
            ))}
          </div>
        )}
      </div>

      <CommunicationDialog
        direction={direction}
        disclosure={{ ...disclosure, setIsOpen: handleOpenChange }}
        initialCommunications={communications}
        onSave={handleSave}
      />
    </HTMLContainer>
  )
}
