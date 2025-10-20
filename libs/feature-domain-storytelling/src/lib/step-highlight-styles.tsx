import { useEditor, useValue } from 'tldraw'
import { $currentStepShapesState } from './states/use-story-play'

export function StoryStepHighlightStyles() {
  const editor = useEditor()
  const currentStepShapes = useValue($currentStepShapesState)

  if (currentStepShapes.size === 0) {
    return null
  }

  const allVisibleShapeIds = editor.getCurrentPageShapeIds()
  const dimmedShapeIds = Array.from(allVisibleShapeIds).filter((id) => !currentStepShapes.has(id))

  const css = dimmedShapeIds.map((id) => `[data-shape-id="${id}"] { opacity: 0.4 !important; }`).join('\n')

  return <style>{css}</style>
}
