import { useDocumentName } from './use-document-name'
import { atom, Editor, getSnapshot, loadSnapshot, RecordsDiff, TLRecord, useEditor, useValue } from 'tldraw'
import { toast } from 'sonner'
import { decompressFromEncodedURIComponent } from 'lz-string'
import { resetTrackedChanges } from './use-change-tracking'

function isPlainObjectEmpty(obj: object) {
  for (const _key in obj) return false
  return true
}

const $persistenceState = atom<{
  fileHandle: FileSystemFileHandle | undefined
  latestChangesSaved: boolean
}>('document persistence', { fileHandle: undefined, latestChangesSaved: false })

export interface UseDocumentPersistenceReturn {
  open: () => void
  saveAs: () => void
  save: () => void
  clear: () => void
  hasBeenSavedAs: boolean
  latestChangesSaved: boolean
}

export function useDocumentPersistence(): UseDocumentPersistenceReturn {
  const editor = useEditor()
  const { documentName } = useDocumentName()
  const { fileHandle, latestChangesSaved } = useValue($persistenceState)

  async function open() {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const jsonContent = JSON.parse(await file.text())
    loadSnapshot(editor.store, { document: jsonContent })
    editor.clearHistory()
    goToContent(editor)

    // setTimeout else changeHappened are triggered after latestChangesSaved are set to true
    setTimeout(() => {
      resetTrackedChanges()
      $persistenceState.update((value) => ({ ...value, fileHandle, latestChangesSaved: true }))
    })
  }

  async function saveAs() {
    const newFileHandle = await window.showSaveFilePicker({ suggestedName: documentName + '.json' })
    $persistenceState.update((value) => ({ ...value, fileHandle: newFileHandle }))
    await saveUsingHandle(newFileHandle)
  }

  async function save() {
    const fileHandle = $persistenceState.get().fileHandle
    if (fileHandle == null) {
      await saveAs()
    } else {
      await saveUsingHandle(fileHandle)
    }
  }

  async function saveUsingHandle(handle: FileSystemFileHandle) {
    const document = getSnapshot(editor.store)
    const writableStream = await handle.createWritable()
    await writableStream.write(JSON.stringify(document.document))
    await writableStream.close()

    resetTrackedChanges()
    $persistenceState.update((value) => ({ ...value, latestChangesSaved: true }))
  }

  function clear() {
    $persistenceState.update(() => ({ fileHandle: undefined, latestChangesSaved: false }))
  }

  return {
    open,
    saveAs,
    save,
    clear,
    hasBeenSavedAs: fileHandle != null,
    latestChangesSaved,
  }
}

export function changeHappened(diff: RecordsDiff<TLRecord>) {
  const hasChanges =
    !isPlainObjectEmpty(diff.added) || !isPlainObjectEmpty(diff.removed) || !isPlainObjectEmpty(diff.updated)

  $persistenceState.update((value) => ({ ...value, latestChangesSaved: !hasChanges }))
}

export function loadFromUrlIfNeeded(editor: Editor): boolean {
  try {
    const hash = window.location.hash
    if (!hash.startsWith('#initialDocument=')) {
      return false
    }

    const encodedData = hash.substring('#initialDocument='.length)
    const documentData = decompressFromEncodedURIComponent(encodedData)

    const document = JSON.parse(documentData)
    loadSnapshot(editor.store, { document })
    editor.clearHistory()

    goToContent(editor)

    return true
  } catch (error) {
    console.error('Failed to load document from URL:', error)
    toast.error('Failed to load document', {
      description: 'The shared link appears to be invalid or corrupted.',
    })
    return false
  } finally {
    // Clear the hash to prevent reloading on refresh
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

function goToContent(editor: Editor) {
  const bounds = editor.getSelectionPageBounds() ?? editor.getCurrentPageBounds()
  if (!bounds) return
  editor.zoomToBounds(bounds, {
    targetZoom: Math.min(1, editor.getZoomLevel()),
  })
}
