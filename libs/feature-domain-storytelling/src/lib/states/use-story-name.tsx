import { useEditor, useValue } from 'tldraw'

export interface UseStoryNameReturn {
  storyName: string
  setStoryName: (storyName: string) => void
}

export function useStoryName(): UseStoryNameReturn {
  const editor = useEditor()
  const storyName = useValue('name', () => editor.getDocumentSettings().name || 'untitled', [])

  return {
    storyName,
    setStoryName: (storyName: string) => editor.updateDocumentSettings({ name: storyName }),
  }
}
