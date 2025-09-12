import { StickyNoteType } from '../types/sticky-note-types'

export const STICKY_NOTE_SIZE = 120

export const STICKY_NOTE_LABELS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'Events',
  [StickyNoteType.COMMAND]: 'Commands',
  [StickyNoteType.AGGREGATE]: 'Aggregates',
  [StickyNoteType.EXTERNAL_SYSTEM]: 'External Systems',
  [StickyNoteType.POLICY]: 'Policies',
  [StickyNoteType.READ_MODEL]: 'Read Models',
}

export const STICKY_NOTE_BG_COLORS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'bg-orange-400',
  [StickyNoteType.COMMAND]: 'bg-blue-400',
  [StickyNoteType.AGGREGATE]: 'bg-yellow-400',
  [StickyNoteType.EXTERNAL_SYSTEM]: 'bg-pink-400',
  [StickyNoteType.POLICY]: 'bg-purple-400',
  [StickyNoteType.READ_MODEL]: 'bg-green-400',
}

export const STICKY_NOTE_TEXT_COLORS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'text-orange-400',
  [StickyNoteType.COMMAND]: 'text-blue-400',
  [StickyNoteType.AGGREGATE]: 'text-yellow-400',
  [StickyNoteType.EXTERNAL_SYSTEM]: 'text-pink-400',
  [StickyNoteType.POLICY]: 'text-purple-400',
  [StickyNoteType.READ_MODEL]: 'text-green-400',
}
