import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ddd-toolbox/ui'
import { HelpCircleIcon } from 'lucide-react'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_LABELS, STICKY_NOTE_BG_COLORS } from '../shapes/sticky-note-constants'
import { cn } from '@ddd-toolbox/util'

const STICKY_NOTE_DESCRIPTIONS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]:
    'Domain Events represent something important that happened in the business domain, expressed in past tense. Examples: "Order Placed", "Payment Processed", "Customer Registered". Start with these and place them chronologically from left to right.',
  [StickyNoteType.COMMAND]:
    'Commands represent intentions or requests to change the system state, typically triggered by users or external systems. They express what someone wants to happen, written in imperative form. Examples: "Place Order", "Process Payment", "Register Customer".',
  [StickyNoteType.ACTOR]:
    'Actors represent the people, roles, or external systems that trigger commands or react to events. They answer "who" is involved in the process. Examples: "Customer", "Admin", "Payment Gateway", "Inventory System".',
  [StickyNoteType.POLICY]:
    'Policies represent business rules, automated reactions, or workflows that connect events to commands. They describe "whenever this happens, then do that" scenarios. Examples: "When payment fails, send notification", "When stock is low, reorder automatically".',
  [StickyNoteType.QUERY_MODEL]:
    'Query Models (Read Models) represent the information needed to make decisions or display data to users. They answer "what information do we need?" Examples: "Customer Profile", "Order History", "Inventory Levels".',
  [StickyNoteType.CONSTRAINT]:
    'Constraints represent business rules, limitations, or invariants that must be respected. They describe what cannot happen or conditions that must be met. Examples: "Cannot order more than available stock", "Customer must be verified".',
  [StickyNoteType.SYSTEM]:
    'Systems represent external services, legacy systems, or bounded contexts that participate in the process but are outside the current modeling scope. Examples: "Payment Provider", "Email Service", "Legacy ERP System".',
  [StickyNoteType.HOTSPOT]:
    'Hotspots mark areas of uncertainty, disagreement, or complexity that need further investigation. They highlight problems, risks, or questions that emerge during the session. Examples: "Unclear business rule", "Performance bottleneck".',
}

export function StickyNoteHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground absolute right-0 bottom-0 left-0 w-full [&_svg]:size-5"
        >
          <HelpCircleIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Storming Sticky Notes Guide</DialogTitle>
          <DialogDescription>
            Learn about each sticky note type and when to use them in your Event Storming sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          {Object.values(StickyNoteType).map((type) => (
            <div key={type} className="flex gap-4 rounded-lg border p-4">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-sm text-xs font-semibold text-white shadow-sm',
                    STICKY_NOTE_BG_COLORS[type],
                  )}
                >
                  NOTE
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">{STICKY_NOTE_LABELS[type]}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{STICKY_NOTE_DESCRIPTIONS[type]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted mt-6 rounded-lg p-4">
          <h4 className="mb-2 font-semibold">Event Storming Tips</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Start with Domain Events (orange) and place them chronologically</li>
            <li>• Add Commands (blue) that trigger events</li>
            <li>• Identify Actors (light yellow) who initiate commands</li>
            <li>• Use Hotspots (red) to mark areas that need discussion</li>
            <li>• Connect events with Policies (purple) to show business rules</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
