import { Editor, renderPlaintextFromRichText, TLRichText } from 'tldraw'

/**
 * Safely converts richText to plain text string.
 * Returns empty string if richText is null/undefined.
 */
export function toPlainText(editor: Editor, richText: TLRichText | null | undefined): string {
  if (!richText) return ''
  return renderPlaintextFromRichText(editor, richText)
}
