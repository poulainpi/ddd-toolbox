import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldLabel,
  Input,
  Toggle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@ddd-toolbox/ui'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Communication,
  CommunicationMessage,
  MessageType,
  COLLABORATOR_ICONS,
  COLLABORATOR_TYPES,
  COLLABORATOR_TYPE_LABELS,
  MESSAGE_TYPE_COLORS,
  RELATIONSHIP_DESCRIPTIONS,
  RELATIONSHIP_TYPES,
} from '../types/communication-types'

interface CommunicationDialogProps {
  direction: 'inbound' | 'outbound'
  disclosure: UseDisclosureReturn
  initialCommunications: Communication[]
  onSave: (communications: Communication[]) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyMessage(): CommunicationMessage {
  return { id: generateId(), label: '', type: 'event' }
}

function emptyCommunication(): Communication {
  return {
    id: generateId(),
    collaboratorName: '',
    collaboratorType: 'bounded-context',
    leftRelationshipType: undefined,
    rightRelationshipType: undefined,
    messages: [emptyMessage()],
  }
}

export function CommunicationDialog({
  direction,
  disclosure,
  initialCommunications,
  onSave,
}: CommunicationDialogProps) {
  const [communications, setCommunications] = useState<Communication[]>(initialCommunications)
  const [editingEntry, setEditingEntry] = useState<Communication | null>(null)
  const [isLayer2, setIsLayer2] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCommunications(initialCommunications)
      setEditingEntry(null)
      setIsLayer2(false)
    }
    disclosure.setIsOpen(open)
  }

  const handleAddCollaborator = () => {
    const entry = emptyCommunication()
    setEditingEntry(entry)
    setIsLayer2(true)
  }

  const handleEditCollaborator = (communication: Communication) => {
    setEditingEntry({ ...communication, messages: communication.messages.map((message) => ({ ...message })) })
    setIsLayer2(true)
  }

  const handleDeleteCollaborator = (id: string) => {
    setCommunications((previous) => previous.filter((communication) => communication.id !== id))
  }

  const handleReorderCommunication = (fromIndex: number, toIndex: number) => {
    setCommunications((previous) => {
      const result = [...previous]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }

  const handleBack = () => {
    setEditingEntry(null)
    setIsLayer2(false)
  }

  const handleSaveEntry = () => {
    if (!editingEntry) return
    setCommunications((previous) => {
      const existing = previous.find((communication) => communication.id === editingEntry.id)
      if (existing) {
        return previous.map((communication) => (communication.id === editingEntry.id ? editingEntry : communication))
      }
      return [...previous, editingEntry]
    })
    setEditingEntry(null)
    setIsLayer2(false)
  }

  const handleSaveAll = () => {
    onSave(communications)
    disclosure.close()
  }

  const updateMessage = (messageId: string, field: keyof CommunicationMessage, value: string) => {
    if (!editingEntry) return
    setEditingEntry({
      ...editingEntry,
      messages: editingEntry.messages.map((message) =>
        message.id === messageId ? { ...message, [field]: value } : message,
      ),
    })
  }

  const addMessage = () => {
    if (!editingEntry) return
    setEditingEntry({ ...editingEntry, messages: [...editingEntry.messages, emptyMessage()] })
  }

  const deleteMessage = (messageId: string) => {
    if (!editingEntry) return
    setEditingEntry({ ...editingEntry, messages: editingEntry.messages.filter((message) => message.id !== messageId) })
  }

  const title = direction === 'inbound' ? 'Inbound Communication' : 'Outbound Communication'

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <div tabIndex={0} className="h-0 w-0 overflow-hidden outline-none" />
        <DialogHeader>
          <DialogTitle>
            {isLayer2
              ? editingEntry && communications.find((communication) => communication.id === editingEntry.id)
                ? 'Edit Collaborator'
                : 'Add Collaborator'
              : title}
          </DialogTitle>
        </DialogHeader>

        {!isLayer2 ? (
          <Layer1
            communications={communications}
            onAdd={handleAddCollaborator}
            onEdit={handleEditCollaborator}
            onDelete={handleDeleteCollaborator}
            onReorder={handleReorderCommunication}
            onSave={handleSaveAll}
            onCancel={() => handleOpenChange(false)}
          />
        ) : editingEntry ? (
          <TooltipProvider delayDuration={0}>
            <Layer2
              entry={editingEntry}
              onChange={setEditingEntry}
              onUpdateMessage={updateMessage}
              onAddMessage={addMessage}
              onDeleteMessage={deleteMessage}
              onBack={handleBack}
              onSave={handleSaveEntry}
            />
          </TooltipProvider>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Layer1({
  communications,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  onSave,
  onCancel,
}: {
  communications: Communication[]
  onAdd: () => void
  onEdit: (communication: Communication) => void
  onDelete: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-96 flex-col gap-3 overflow-y-auto pr-1">
        {communications.length === 0 && (
          <div className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
            No communications yet. Add one below.
          </div>
        )}
        {communications.map((communication, index) => {
          const Icon = COLLABORATOR_ICONS[communication.collaboratorType]
          const isFirst = index === 0
          const isLast = index === communications.length - 1
          return (
            <div
              key={communication.id}
              className="bg-muted/30 cursor-pointer rounded-lg border"
              onClick={() => onEdit(communication)}
            >
              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="text-muted-foreground h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-medium">{communication.collaboratorName || '(unnamed)'}</span>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-7 w-7"
                    onClick={(event) => {
                      event.stopPropagation()
                      onEdit(communication)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-7 w-7"
                    disabled={isFirst}
                    onClick={(event) => {
                      event.stopPropagation()
                      onReorder(index, index - 1)
                    }}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-7 w-7"
                    disabled={isLast}
                    onClick={(event) => {
                      event.stopPropagation()
                      onReorder(index, index + 1)
                    }}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive -mr-1 h-7 w-7"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDelete(communication.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3">
                {communication.leftRelationshipType && (
                  <span className="bg-foreground text-background rotate-180 rounded px-1.5 py-0.5 font-mono text-xs [writing-mode:vertical-rl]">
                    {communication.leftRelationshipType}
                  </span>
                )}
                {communication.messages.map((message) => (
                  <span
                    key={message.id}
                    className={`rounded px-1.5 py-0.5 text-xs ${MESSAGE_TYPE_COLORS[message.type]}`}
                  >
                    {message.label || message.type}
                  </span>
                ))}
                {communication.rightRelationshipType && (
                  <span className="bg-foreground text-background rotate-180 rounded px-1.5 py-0.5 font-mono text-xs [writing-mode:vertical-rl]">
                    {communication.rightRelationshipType}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Button variant="outline" onClick={onAdd} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Communication
      </Button>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </DialogFooter>
    </div>
  )
}

function Layer2({
  entry,
  onChange,
  onUpdateMessage,
  onAddMessage,
  onDeleteMessage,
  onBack,
  onSave,
}: {
  entry: Communication
  onChange: (communication: Communication) => void
  onUpdateMessage: (messageId: string, field: keyof CommunicationMessage, value: string) => void
  onAddMessage: () => void
  onDeleteMessage: (messageId: string) => void
  onBack: () => void
  onSave: () => void
}) {
  const collaboratorNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    collaboratorNameRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-1 -my-1 flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-1 py-1">
        <Field>
          <FieldLabel htmlFor="collaborator-name">Collaborator Name</FieldLabel>
          <Input
            ref={collaboratorNameRef}
            id="collaborator-name"
            value={entry.collaboratorName}
            onChange={(e) => onChange({ ...entry, collaboratorName: e.target.value })}
            placeholder="e.g. Order Management"
          />
        </Field>

        <Field>
          <FieldLabel>Collaborator Type</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {COLLABORATOR_TYPES.map((collaboratorType) => {
              const Icon = COLLABORATOR_ICONS[collaboratorType]
              return (
                <Toggle
                  key={collaboratorType}
                  variant="outline"
                  pressed={entry.collaboratorType === collaboratorType}
                  onPressedChange={() => onChange({ ...entry, collaboratorType })}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-6 w-6" />
                  {COLLABORATOR_TYPE_LABELS[collaboratorType]}
                </Toggle>
              )
            })}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Left Relationship</FieldLabel>
            <div className="flex flex-wrap gap-1">
              {RELATIONSHIP_TYPES.map((relationship) => (
                <Tooltip key={relationship}>
                  <TooltipTrigger asChild>
                    <div>
                      <Toggle
                        variant="outline"
                        pressed={entry.leftRelationshipType === relationship}
                        onPressedChange={() =>
                          onChange({
                            ...entry,
                            leftRelationshipType:
                              entry.leftRelationshipType === relationship ? undefined : relationship,
                          })
                        }
                        className="font-mono text-xs"
                      >
                        {relationship}
                      </Toggle>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{RELATIONSHIP_DESCRIPTIONS[relationship]}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel>Right Relationship</FieldLabel>
            <div className="flex flex-wrap gap-1">
              {RELATIONSHIP_TYPES.map((relationship) => (
                <Tooltip key={relationship}>
                  <TooltipTrigger asChild>
                    <div>
                      <Toggle
                        variant="outline"
                        pressed={entry.rightRelationshipType === relationship}
                        onPressedChange={() =>
                          onChange({
                            ...entry,
                            rightRelationshipType:
                              entry.rightRelationshipType === relationship ? undefined : relationship,
                          })
                        }
                        className="font-mono text-xs"
                      >
                        {relationship}
                      </Toggle>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{RELATIONSHIP_DESCRIPTIONS[relationship]}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Field>
        </div>

        <Field>
          <FieldLabel>Messages</FieldLabel>
          <div className="flex flex-col gap-2">
            {entry.messages.map((message) => (
              <div key={message.id} className="flex items-center gap-2">
                <Input
                  value={message.label}
                  onChange={(e) => onUpdateMessage(message.id, 'label', e.target.value)}
                  placeholder="Message label"
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {(['command', 'event', 'query'] as MessageType[]).map((messageType) => (
                    <Toggle
                      key={messageType}
                      variant="outline"
                      pressed={message.type === messageType}
                      onPressedChange={() => onUpdateMessage(message.id, 'type', messageType)}
                      className={`text-xs capitalize ${message.type === messageType ? MESSAGE_TYPE_COLORS[messageType] : ''}`}
                    >
                      {messageType}
                    </Toggle>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7 shrink-0"
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={onAddMessage} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Message
            </Button>
          </div>
        </Field>
      </div>

      <DialogFooter className="justify-between sm:justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onSave}>Save</Button>
      </DialogFooter>
    </div>
  )
}
