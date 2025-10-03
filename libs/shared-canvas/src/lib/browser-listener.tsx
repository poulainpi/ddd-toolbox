import { track, useEditor } from 'tldraw'
import { useEffect } from 'react'
import { useDocumentPersistence } from './hooks/use-document-persistence'

export const BrowserListener = track(function BrowserListener() {
  const { save, latestChangesSaved } = useDocumentPersistence()
  const editor = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      if (target.tagName?.toLowerCase() === 'textarea' || target.role?.toLowerCase() === 'textbox') {
        if (e.key === 'Enter' && !e.shiftKey) {
          editor.complete()
        }
      }

      switch (e.key) {
        case 's': {
          if (isControlKeyPressed(e)) {
            e.preventDefault()
            save()
          }
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, save])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!latestChangesSaved) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [latestChangesSaved])

  return null
})

function isControlKeyPressed(e: KeyboardEvent) {
  return e.ctrlKey || e.metaKey
}
