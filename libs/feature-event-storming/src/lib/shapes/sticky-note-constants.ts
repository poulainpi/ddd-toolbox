import { StickyNoteType } from '../types/sticky-note-types'

export const STICKY_NOTE_SIZE = 140

export const STICKY_NOTE_LABELS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'Domain Events',
  [StickyNoteType.COMMAND]: 'Commands',
  [StickyNoteType.CONSTRAINT]: 'Constraints',
  [StickyNoteType.SYSTEM]: 'Systems',
  [StickyNoteType.POLICY]: 'Policies',
  [StickyNoteType.QUERY_MODEL]: 'Query Models',
  [StickyNoteType.ACTOR]: 'Actors',
  [StickyNoteType.HOTSPOT]: 'Hotspots',
}

export const STICKY_NOTE_BG_COLORS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'bg-orange-400',
  [StickyNoteType.COMMAND]: 'bg-blue-400',
  [StickyNoteType.CONSTRAINT]: 'bg-yellow-400',
  [StickyNoteType.SYSTEM]: 'bg-pink-400',
  [StickyNoteType.POLICY]: 'bg-purple-300',
  [StickyNoteType.QUERY_MODEL]: 'bg-green-400',
  [StickyNoteType.ACTOR]: 'bg-yellow-200',
  [StickyNoteType.HOTSPOT]: 'bg-red-500',
}

export const STICKY_NOTE_TEXT_COLORS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'text-orange-400',
  [StickyNoteType.COMMAND]: 'text-blue-400',
  [StickyNoteType.CONSTRAINT]: 'text-yellow-400',
  [StickyNoteType.SYSTEM]: 'text-pink-400',
  [StickyNoteType.POLICY]: 'text-purple-300',
  [StickyNoteType.QUERY_MODEL]: 'text-green-400',
  [StickyNoteType.ACTOR]: 'text-yellow-200',
  [StickyNoteType.HOTSPOT]: 'text-red-500',
}
