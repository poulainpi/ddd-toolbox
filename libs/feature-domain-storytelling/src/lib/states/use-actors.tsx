import { useEditor, useValue } from 'tldraw'

const DEFAULT_ACTORS = ['user', 'users', 'server']

export interface UseActorsReturn {
  actors: string[]
  addActor: (actor: string) => void
  deleteActor: (actor: string) => void
  setActors: (actors: string[]) => void
}

export function useActors(): UseActorsReturn {
  const editor = useEditor()
  const actors = useValue('actors', () => (editor.getDocumentSettings().meta.actors as string[]) || DEFAULT_ACTORS, [])

  return {
    actors,
    addActor: (actor: string) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          actors: [...actors, actor],
        },
      }),
    deleteActor: (actor: string) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          actors: actors.filter((a) => a !== actor),
        },
      }),
    setActors: (actors: string[]) =>
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          actors,
        },
      }),
  }
}
