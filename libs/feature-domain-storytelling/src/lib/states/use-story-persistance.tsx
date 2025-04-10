import { useStoryName } from './use-story-name'
import { atom, getSnapshot, loadSnapshot, useEditor, useValue } from 'tldraw'

const $persistanceState = atom<{
  fileHandle: FileSystemFileHandle | undefined
  latestChangesSaved: boolean
}>('story name', { fileHandle: undefined, latestChangesSaved: false })

export interface UseStoryPersistanceReturn {
  open: () => void
  saveAs: () => void
  save: () => void
  hasBeenSavedAs: boolean
  latestChangesSaved: boolean
}

export function useStoryPersistance(): UseStoryPersistanceReturn {
  const editor = useEditor()
  const { storyName } = useStoryName()
  const { fileHandle, latestChangesSaved } = useValue($persistanceState)

  async function open() {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const jsonContent = JSON.parse(await file.text())
    loadSnapshot(editor.store, { document: jsonContent })

    // setTimeout else changeHappened are triggered after latestChangesSaved are set to true
    setTimeout(() => $persistanceState.update((value) => ({ ...value, fileHandle, latestChangesSaved: true })))
  }

  async function saveAs() {
    const newFileHandle = await window.showSaveFilePicker({ suggestedName: storyName + '.json' })
    $persistanceState.update((value) => ({ ...value, fileHandle: newFileHandle }))
    await saveUsingHandle(newFileHandle)
  }

  async function save() {
    const fileHandle = $persistanceState.get().fileHandle
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

    $persistanceState.update((value) => ({ ...value, latestChangesSaved: true }))
  }

  return {
    open,
    saveAs,
    save,
    hasBeenSavedAs: fileHandle != null,
    latestChangesSaved,
  }
}

export function changeHappened() {
  $persistanceState.update((value) => ({ ...value, latestChangesSaved: false }))
}
