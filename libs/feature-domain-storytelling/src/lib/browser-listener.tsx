import { track, useEditor } from 'tldraw'
import { useEffect } from 'react'
import { useStoryPersistence } from './states/use-story-persistence'

export const BrowserListener = track(function BrowserListener() {
  const { save, latestChangesSaved } = useStoryPersistence()
  const editor = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      if (target.tagName?.toLowerCase() === 'textarea') {
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

  return <></>
})

function isControlKeyPressed(e: KeyboardEvent) {
  return e.ctrlKey || e.metaKey
}
