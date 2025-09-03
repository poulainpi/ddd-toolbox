import { useEditor, useValue } from 'tldraw'

export interface UseDocumentNameReturn {
  documentName: string
  setDocumentName: (documentName: string) => void
}

export function useDocumentName(): UseDocumentNameReturn {
  const editor = useEditor()
  const documentName = useValue('name', () => editor.getDocumentSettings().name || 'untitled', [])

  return {
    documentName,
    setDocumentName: (documentName: string) => editor.updateDocumentSettings({ name: documentName }),
  }
}
