import {
  atom,
  Editor,
  getArrowBindings,
  TLArrowBindingProps,
  TLArrowShape,
  TLShape,
  TLShapeId,
  useEditor,
  useValue,
} from 'tldraw'
import { getActivitiesArrows } from '../shapes/activities-arrows'
import { ActorShapeUtil } from '../shapes/actor-shape-util'

export const $hiddenShapesState = atom<Set<TLShapeId>>('hidden shapes', new Set())

type StoryPlayStateProps = {
  isPlaying: boolean
  currentStep: number
  stepsCount: number
  activitiesArrows: TLArrowShape[]
  appearedShapeIdsPerStep: TLShapeId[][]
}

const defaultState: StoryPlayStateProps = {
  isPlaying: false,
  currentStep: 0,
  stepsCount: 0,
  activitiesArrows: [],
  appearedShapeIdsPerStep: [],
}

const $storyPlayState = atom<StoryPlayStateProps>('story play', defaultState)

export interface UseStoryPlayReturn {
  isPlaying: boolean
  currentStep: number
  stepsCount: number
  play: () => void
  stop: () => void
  stepBackward: () => void
  stepForward: () => void
}

export function useStoryPlay(): UseStoryPlayReturn {
  const editor = useEditor()
  const { isPlaying, currentStep } = useValue($storyPlayState)

  const updateHiddenShapes = (hiddenShapeIds: Set<TLShapeId>) => {
    $hiddenShapesState.update(() => hiddenShapeIds)
  }

  const updateState = (state: Partial<StoryPlayStateProps>) => {
    $storyPlayState.update((value) => ({ ...value, ...state }))
  }

  const play = () => {
    editor.updateInstanceState({ isReadonly: true })
    if ($hiddenShapesState.get().size === 0) {
      updateState({ isPlaying: true, activitiesArrows: getActivitiesArrows(editor) })

      const allShapeIds = new Set(editor.getCurrentPageShapeIds().values())
      updateHiddenShapes(allShapeIds)
      stepForward()
    }
  }

  const stop = () => {
    editor.updateInstanceState({ isReadonly: false })
    updateState(defaultState)
    updateHiddenShapes(new Set())
  }

  const stepBackward = () => {
    if ($storyPlayState.get().currentStep === 1) return
    const shapeIdsToHide =
      $storyPlayState.get().appearedShapeIdsPerStep[$storyPlayState.get().appearedShapeIdsPerStep.length - 1] ?? []
    updateHiddenShapes(new Set([...$hiddenShapesState.get(), ...shapeIdsToHide]))
    updateState({
      currentStep: $storyPlayState.get().currentStep - 1,
      appearedShapeIdsPerStep: $storyPlayState.get().appearedShapeIdsPerStep.slice(0, -1),
    })
  }

  const stepForward = () => {
    if ($storyPlayState.get().currentStep === getStepsCount()) return

    const nextStep = $storyPlayState.get().currentStep + 1

    const shapeIdsToShow = getShapeIdsAtStep(nextStep).filter((shapeId) => {
      return $hiddenShapesState.get().has(shapeId)
    })
    updateHiddenShapes(
      new Set([...$hiddenShapesState.get()].filter((hiddenShapeId) => !shapeIdsToShow.includes(hiddenShapeId))),
    )
    updateState({
      currentStep: nextStep,
      appearedShapeIdsPerStep: [...$storyPlayState.get().appearedShapeIdsPerStep, shapeIdsToShow],
    })
  }

  const getStepsCount = (): number => {
    return $storyPlayState.get().activitiesArrows.length
  }

  const getShapeIdsAtStep = (step: number): TLShapeId[] => {
    return $storyPlayState
      .get()
      .activitiesArrows.filter((arrow) => arrow.meta.activityNumber === step)
      .map((arrow) => [arrow.id, ...getLinkedShapeIdsOf(arrow, editor)])
      .flat()
  }

  return {
    isPlaying,
    currentStep,
    stepsCount: getStepsCount(),
    play,
    stop,
    stepBackward,
    stepForward,
  }
}

function getLinkedShapeIdsOf(shape: TLShape, editor: Editor): TLShapeId[] {
  if (shape.type === ActorShapeUtil.type) {
    return [shape.id]
  }

  const shapeIds = new Set<TLShapeId>([shape.id])

  if (shape.type === 'arrow') {
    const { start: startBinding, end: endBinding } = getArrowBindings(editor, shape as TLArrowShape)
    if (startBinding != null) {
      shapeIds.add(startBinding.toId)
    }

    if (endBinding != null) {
      const endShape = editor.getShape(endBinding.toId)
      if (endShape != null) {
        getLinkedShapeIdsOf(endShape, editor).forEach((id) => shapeIds.add(id))
      }
    }
  } else {
    const bindings = editor
      .getBindingsToShape(shape, 'arrow')
      .filter((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')

    bindings.forEach((binding) => {
      const startArrow = editor.getShape(binding.fromId)
      if (startArrow != null) {
        getLinkedShapeIdsOf(startArrow, editor).forEach((id) => shapeIds.add(id))
      }
    })
  }

  return Array.from(shapeIds)
}
