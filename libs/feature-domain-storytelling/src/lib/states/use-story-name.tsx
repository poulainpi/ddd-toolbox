import { atom, useValue } from 'tldraw'

export const $storyName = atom<string>('story name', 'untitled')

export function useStoryName() {
  return useValue($storyName)
}

export function changeStoryName(name: string) {
  $storyName.set(name)
}
