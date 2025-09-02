import { useStoryName } from './use-story-name'
import { atom, getSnapshot, loadSnapshot, useEditor, useValue } from 'tldraw'

const $persistenceState = atom<{
  fileHandle: FileSystemFileHandle | undefined
  latestChangesSaved: boolean
}>('story name', { fileHandle: undefined, latestChangesSaved: false })

export interface UseStoryPersistenceReturn {
  open: () => void
  saveAs: () => void
  save: () => void
  clear: () => void
  hasBeenSavedAs: boolean
  latestChangesSaved: boolean
}

export function useStoryPersistence(): UseStoryPersistenceReturn {
  const editor = useEditor()
  const { storyName } = useStoryName()
  const { fileHandle, latestChangesSaved } = useValue($persistenceState)

  async function open() {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const jsonContent = JSON.parse(await file.text())
    loadSnapshot(editor.store, { document: jsonContent })

    // setTimeout else changeHappened are triggered after latestChangesSaved are set to true
    setTimeout(() => $persistenceState.update((value) => ({ ...value, fileHandle, latestChangesSaved: true })))
  }

  async function saveAs() {
    const newFileHandle = await window.showSaveFilePicker({ suggestedName: storyName + '.json' })
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

export function changeHappened() {
  $persistenceState.update((value) => ({ ...value, latestChangesSaved: false }))
}
