import { useEffect, useRef } from 'react'
import { atom, RecordsDiff, squashRecordDiffs, TLEventMapHandler, TLRecord, useEditor } from 'tldraw'

const $changeTrackingResetFunction = atom<(() => void) | null>('changeTrackingReset', null)

export function useChangeTracking(onChangeDetected: (diff: RecordsDiff<TLRecord>) => void) {
  const editor = useEditor()
  const unsavedChanges = useRef<RecordsDiff<TLRecord>>({ added: {}, removed: {}, updated: {} })

  const resetChanges = () => {
    unsavedChanges.current = {
      added: {},
      removed: {},
      updated: {},
    }
  }

  useEffect(() => {
    $changeTrackingResetFunction.set(resetChanges)

    const handleDocumentChange: TLEventMapHandler<'change'> = (diff) => {
      unsavedChanges.current = squashRecordDiffs([unsavedChanges.current, diff.changes])
      onChangeDetected(unsavedChanges.current)
    }

    const unsubscribe = editor.store.listen(handleDocumentChange, { scope: 'document' })

    return () => {
      $changeTrackingResetFunction.set(null)
      unsubscribe()
    }
  }, [editor, onChangeDetected])

  return {
    resetChanges,
  }
}

export function resetTrackedChanges() {
  const resetFn = $changeTrackingResetFunction.get()
  if (resetFn) {
    resetFn()
  }
}
