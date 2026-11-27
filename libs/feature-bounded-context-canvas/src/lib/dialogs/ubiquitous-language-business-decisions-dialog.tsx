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
import { useT } from '@ddd-toolbox/i18n'
import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
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

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...items]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

export function UbiquitousLanguageBusinessDecisionsDialog({
  disclosure,
  initialTerms,
  initialDecisions,
  initialTab,
  onSave,
}: UbiquitousLanguageBusinessDecisionsDialogProps) {
  const t = useT()
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
            <DialogTitle>{t('bcc.ulbd.title')}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue={initialTab} className="flex flex-col gap-5">
            <TabsList className="w-full">
              <TabsTrigger value="ubiquitous-language" className="flex-1">
                {t('bcc.ulbd.tabLanguage')}
              </TabsTrigger>
              <TabsTrigger value="business-decisions" className="flex-1">
                {t('bcc.ulbd.tabDecisions')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ubiquitous-language" className="flex flex-col gap-4">
              <div ref={termsListRef} className="flex h-96 flex-col gap-3 overflow-y-auto pr-1">
                {terms.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
                    {t('bcc.ulbd.noTerms')}
                  </div>
                )}
                {terms.map((term, index) => (
                  <div key={term.id} className="bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        {t('bcc.ulbd.termNumber', { number: index + 1 })}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-7 w-7"
                          disabled={index === 0}
                          onClick={() => setTerms((previousTerms) => moveItem(previousTerms, index, index - 1))}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-7 w-7"
                          disabled={index === terms.length - 1}
                          onClick={() => setTerms((previousTerms) => moveItem(previousTerms, index, index + 1))}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
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
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                      <Field>
                        <FieldLabel htmlFor={`term-${term.id}`}>{t('bcc.ulbd.term')}</FieldLabel>
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
                          placeholder={t('bcc.ulbd.termPlaceholder')}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`definition-${term.id}`}>{t('bcc.ulbd.definition')}</FieldLabel>
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
                          placeholder={t('bcc.ulbd.definitionPlaceholder')}
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
                {t('bcc.ulbd.addTerm')}
              </Button>
            </TabsContent>

            <TabsContent value="business-decisions" className="flex flex-col gap-4">
              <div ref={decisionsListRef} className="flex h-96 flex-col gap-3 overflow-y-auto pr-1">
                {decisions.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
                    {t('bcc.ulbd.noDecisions')}
                  </div>
                )}
                {decisions.map((decision, index) => (
                  <div key={decision.id} className="bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        {t('bcc.ulbd.decisionNumber', { number: index + 1 })}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-7 w-7"
                          disabled={index === 0}
                          onClick={() =>
                            setDecisions((previousDecisions) => moveItem(previousDecisions, index, index - 1))
                          }
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-7 w-7"
                          disabled={index === decisions.length - 1}
                          onClick={() =>
                            setDecisions((previousDecisions) => moveItem(previousDecisions, index, index + 1))
                          }
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
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
                    </div>
                    <div className="p-4">
                      <Field>
                        <FieldLabel htmlFor={`decision-${decision.id}`}>{t('bcc.ulbd.description')}</FieldLabel>
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
                          placeholder={t('bcc.ulbd.decisionPlaceholder')}
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
                {t('bcc.ulbd.addDecision')}
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
