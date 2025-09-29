import { useEffect } from 'react'
import { useEditor } from 'tldraw'
import { useChangeTracking } from '../hooks/use-change-tracking'
import { changeHappened, loadFromUrlIfNeeded } from '../hooks/use-document-persistence'
import { events, NEW_DOCUMENT_CREATED } from '../states/events'

export interface OnMountListenerProps {
  defaultPageName?: string
}

export function OnMountListener({ defaultPageName }: OnMountListenerProps) {
  const editor = useEditor()
  useChangeTracking(changeHappened)

  useEffect(() => {
    const setDefaultPageName = defaultPageName
      ? () => {
          const currentPage = editor.getCurrentPage()
          editor.renamePage(currentPage.id, defaultPageName)
        }
      : undefined

    if (setDefaultPageName) {
      setDefaultPageName()
      events.on(NEW_DOCUMENT_CREATED, setDefaultPageName)
    }

    loadFromUrlIfNeeded(editor)

    return () => {
      if (setDefaultPageName) {
        events.off(NEW_DOCUMENT_CREATED, setDefaultPageName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
