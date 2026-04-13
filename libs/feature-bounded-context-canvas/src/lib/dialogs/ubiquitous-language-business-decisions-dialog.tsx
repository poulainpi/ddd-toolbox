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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@ddd-toolbox/ui'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { BusinessDecision, UbiquitousLanguageTerm } from '../types/ubiquitous-language-business-decisions-types'

interface UbiquitousLanguageBusinessDecisionsDialogProps {
  disclosure: UseDisclosureReturn
  initialTerms: UbiquitousLanguageTerm[]
  initialDecisions: BusinessDecision[]
  initialTab: 'ubiquitous-language' | 'business-decisions'
  onSave: (terms: UbiquitousLanguageTerm[], decisions: BusinessDecision[]) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyTerm(): UbiquitousLanguageTerm {
  return { id: generateId(), term: '', definition: '' }
}

function emptyDecision(): BusinessDecision {
  return { id: generateId(), description: '' }
}

export function UbiquitousLanguageBusinessDecisionsDialog({
  disclosure,
  initialTerms,
  initialDecisions,
  initialTab,
  onSave,
}: UbiquitousLanguageBusinessDecisionsDialogProps) {
  const [terms, setTerms] = useState<UbiquitousLanguageTerm[]>(initialTerms)
  const [decisions, setDecisions] = useState<BusinessDecision[]>(initialDecisions)
  const [focusedTermId, setFocusedTermId] = useState<string | null>(null)
  const [focusedDecisionId, setFocusedDecisionId] = useState<string | null>(null)
  const termsListRef = useRef<HTMLDivElement>(null)
  const decisionsListRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    requestAnimationFrame(() => {
      if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTerms(initialTerms)
      setDecisions(initialDecisions)
    }
    disclosure.setIsOpen(open)
  }

  const handleSave = () => {
    onSave(terms, decisions)
    disclosure.close()
  }

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <div tabIndex={0} className="h-0 w-0 overflow-hidden outline-none" />
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <DialogHeader>
            <DialogTitle>Ubiquitous Language & Business Decisions</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue={initialTab} className="flex flex-col gap-5">
            <TabsList className="w-full">
              <TabsTrigger value="ubiquitous-language" className="flex-1">
                Ubiquitous Language
              </TabsTrigger>
              <TabsTrigger value="business-decisions" className="flex-1">
                Business Decisions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ubiquitous-language" className="flex flex-col gap-4">
              <div ref={termsListRef} className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                {terms.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
                    No terms yet. Add one below.
                  </div>
                )}
                {terms.map((term, index) => (
                  <div key={term.id} className="bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Term {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive -mr-1 h-7 w-7"
                        onClick={() =>
                          setTerms((previousTerms) =>
                            previousTerms.filter((existingTerm) => existingTerm.id !== term.id),
                          )
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                      <Field>
                        <FieldLabel htmlFor={`term-${term.id}`}>Term</FieldLabel>
                        <Input
                          ref={(element) => {
                            if (focusedTermId === term.id && element) {
                              element.focus()
                              setFocusedTermId(null)
                            }
                          }}
                          id={`term-${term.id}`}
                          value={term.term}
                          onChange={(event) =>
                            setTerms((previousTerms) =>
                              previousTerms.map((existingTerm) =>
                                existingTerm.id === term.id
                                  ? { ...existingTerm, term: event.target.value }
                                  : existingTerm,
                              ),
                            )
                          }
                          placeholder="e.g. Rule Cluster"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`definition-${term.id}`}>Definition</FieldLabel>
                        <Textarea
                          id={`definition-${term.id}`}
                          value={term.definition}
                          onChange={(event) =>
                            setTerms((previousTerms) =>
                              previousTerms.map((existingTerm) =>
                                existingTerm.id === term.id
                                  ? { ...existingTerm, definition: event.target.value }
                                  : existingTerm,
                              ),
                            )
                          }
                          placeholder="Describe what this term means in this context..."
                          rows={2}
                          className="min-h-0"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const newTerm = emptyTerm()
                  setTerms((previousTerms) => [...previousTerms, newTerm])
                  setFocusedTermId(newTerm.id)
                  scrollToBottom(termsListRef)
                }}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Term
              </Button>
            </TabsContent>

            <TabsContent value="business-decisions" className="flex flex-col gap-4">
              <div ref={decisionsListRef} className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                {decisions.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
                    No decisions yet. Add one below.
                  </div>
                )}
                {decisions.map((decision, index) => (
                  <div key={decision.id} className="bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Decision {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive -mr-1 h-7 w-7"
                        onClick={() =>
                          setDecisions((previousDecisions) =>
                            previousDecisions.filter((existingDecision) => existingDecision.id !== decision.id),
                          )
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Field>
                        <FieldLabel htmlFor={`decision-${decision.id}`}>Description</FieldLabel>
                        <Textarea
                          ref={(element) => {
                            if (focusedDecisionId === decision.id && element) {
                              element.focus()
                              setFocusedDecisionId(null)
                            }
                          }}
                          id={`decision-${decision.id}`}
                          value={decision.description}
                          onChange={(event) =>
                            setDecisions((previousDecisions) =>
                              previousDecisions.map((existingDecision) =>
                                existingDecision.id === decision.id
                                  ? { ...existingDecision, description: event.target.value }
                                  : existingDecision,
                              ),
                            )
                          }
                          placeholder="Describe the business rule or policy..."
                          rows={3}
                          className="min-h-0"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const newDecision = emptyDecision()
                  setDecisions((previousDecisions) => [...previousDecisions, newDecision])
                  setFocusedDecisionId(newDecision.id)
                  scrollToBottom(decisionsListRef)
                }}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Decision
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
