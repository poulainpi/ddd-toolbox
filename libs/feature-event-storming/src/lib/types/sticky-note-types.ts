export enum StickyNoteType {
  EVENT = 'event',
  COMMAND = 'command',
  AGGREGATE = 'aggregate',
  EXTERNAL_SYSTEM = 'external-system',
  POLICY = 'policy',
  READ_MODEL = 'read-model',
}

export const STICKY_NOTE_COLORS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: '#ff9800', // Orange
  [StickyNoteType.COMMAND]: '#2196f3', // Blue
  [StickyNoteType.AGGREGATE]: '#ffeb3b', // Yellow
  [StickyNoteType.EXTERNAL_SYSTEM]: '#e91e63', // Pink
  [StickyNoteType.POLICY]: '#9c27b0', // Purple
  [StickyNoteType.READ_MODEL]: '#4caf50', // Green
}

export const STICKY_NOTE_LABELS: Record<StickyNoteType, string> = {
  [StickyNoteType.EVENT]: 'Events',
  [StickyNoteType.COMMAND]: 'Commands',
  [StickyNoteType.AGGREGATE]: 'Aggregates',
  [StickyNoteType.EXTERNAL_SYSTEM]: 'External Systems',
  [StickyNoteType.POLICY]: 'Policies',
  [StickyNoteType.READ_MODEL]: 'Read Models',
}
