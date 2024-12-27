import { atom, useValue } from 'tldraw'

export const $actors = atom<string[]>('actors', ['user', 'users', 'server'])
export const $workObjects = atom<string[]>('work objects', [
  'message-circle',
  'phone',
  'file',
  'at-sign',
  'dollar-sign',
  'calendar',
  'thumbs-up',
  'thumbs-down',
])

export function useActors() {
  return useValue($actors)
}

export function addActor(actor: string) {
  $actors.update((actors) => [...actors, actor])
}

export function deleteActor(actor: string) {
  $actors.update((actors) => actors.filter((a) => a !== actor))
}

export function setActors(actors: string[]) {
  $actors.set(actors)
}

export function useWorkObjects() {
  return useValue($workObjects)
}

export function addWorkObject(workObject: string) {
  $workObjects.update((workObjects) => [...workObjects, workObject])
}

export function deleteWorkObject(workObject: string) {
  $workObjects.update((workObjects) => workObjects.filter((wo) => wo !== workObject))
}

export function setWorkObjects(workObjects: string[]) {
  $workObjects.set(workObjects)
}
