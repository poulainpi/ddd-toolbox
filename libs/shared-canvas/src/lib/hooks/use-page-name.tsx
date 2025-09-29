import { useEditor, useValue } from 'tldraw'

export interface UsePageNameReturn {
  pageName: string
  setPageName: (pageName: string) => void
}

export function usePageName(): UsePageNameReturn {
  const editor = useEditor()
  const pageName = useValue('page name', () => editor.getCurrentPage().name || 'untitled', [editor])

  return {
    pageName,
    setPageName: (pageName: string) => {
      const currentPage = editor.getCurrentPage()
      editor.renamePage(currentPage.id, pageName)
    },
  }
}
