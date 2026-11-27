import type { MessageKey } from '@ddd-toolbox/i18n'
import { StickyNoteType } from '../types/sticky-note-types'

export const STICKY_NOTE_SIZE = 140
export const ACTOR_STICKY_NOTE_SIZE = 110

export function getStickyNoteSize(type: StickyNoteType): number {
  return type === StickyNoteType.ACTOR ? ACTOR_STICKY_NOTE_SIZE : STICKY_NOTE_SIZE
}

export const STICKY_NOTE_LABEL_KEYS: Record<StickyNoteType, MessageKey> = {
  [StickyNoteType.EVENT]: 'es.sticky.event',
  [StickyNoteType.COMMAND]: 'es.sticky.command',
  [StickyNoteType.CONSTRAINT]: 'es.sticky.constraint',
  [StickyNoteType.SYSTEM]: 'es.sticky.system',
  [StickyNoteType.POLICY]: 'es.sticky.policy',
  [StickyNoteType.QUERY_MODEL]: 'es.sticky.queryModel',
  [StickyNoteType.ACTOR]: 'es.sticky.actor',
  [StickyNoteType.HOTSPOT]: 'es.sticky.hotspot',
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
