import { useEditor, useValue } from 'tldraw'

const DEFAULT_WORK_OBJECTS = [
  'message-circle',
  'phone',
  'file',
  'at-sign',
  'dollar-sign',
  'calendar',
  'thumbs-up',
  'thumbs-down',
]

export interface UseWorkObjectsReturn {
  workObjects: string[]
  addWorkObject: (workObject: string) => void
  deleteWorkObject: (workObject: string) => void
  setWorkObjects: (workObjects: string[]) => void
}

export function useWorkObjects(): UseWorkObjectsReturn {
  const editor = useEditor()
  const workObjects = useValue(
    'workObjects',
    () => (editor.getDocumentSettings().meta.workObjects as string[]) || DEFAULT_WORK_OBJECTS,
    [],
  )

  return {
    workObjects,
    addWorkObject: (workObject: string) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          workObjects: [...workObjects, workObject],
        },
      }),
    deleteWorkObject: (workObject: string) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          workObjects: workObjects.filter((wo) => wo !== workObject),
        },
      }),
    setWorkObjects: (workObjects: string[]) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          workObjects,
        },
      }),
  }
}
