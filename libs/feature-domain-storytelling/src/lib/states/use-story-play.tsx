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
import { WorkObjectShapeUtil } from '../shapes/work-object-shape-util'
import { CommentShapeUtil } from '../shapes/comment-shape-util'
import { toast } from 'sonner'

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

  const findMissingActivityNumbers = (activitiesNumbers: number[]): number[] => {
    const maxNumber = Math.max(...activitiesNumbers)
    const allNumbers = new Set(Array.from({ length: maxNumber }, (_, i) => i + 1))
    const existingNumbers = new Set(activitiesNumbers)

    const missingNumbers = Array.from(new Set([...allNumbers].filter((num) => !existingNumbers.has(num))))
    return missingNumbers
  }

  const canPlayOrShowError = (activitiesArrows: TLArrowShape[]): boolean => {
    const activitiesNumbers = activitiesArrows.map((arrow) => arrow.meta.activityNumber as number)
    const missingActivityNumbers = findMissingActivityNumbers(activitiesNumbers)
    if (missingActivityNumbers.length > 0) {
      toast.error('Domain Story is incomplete', {
        description: `The following activity numbers are missing: ${missingActivityNumbers.join(', ')}`,
      })
      return false
    }
    return true
  }

  const play = () => {
    if ($hiddenShapesState.get().size === 0) {
      const activitiesArrows = getActivitiesArrows(editor)
      if (!canPlayOrShowError(activitiesArrows)) return

      editor.updateInstanceState({ isReadonly: true })
      updateState({ isPlaying: true, activitiesArrows: activitiesArrows })

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
  const shapeIds = new Set<TLShapeId>([shape.id])

  if (shape.type === 'arrow') {
    const { start: startBinding, end: endBinding } = getArrowBindings(editor, shape as TLArrowShape)
    if (startBinding != null) {
      const startShape = editor.getShape(startBinding.toId)
      if (startShape != null) {
        shapeIds.add(startShape.id)
        if (startShape.type === ActorShapeUtil.type) {
          getCommentShapeIdsLinkedTo(startShape, editor).forEach((id) => shapeIds.add(id))
        }
      }
    }

    if (endBinding != null) {
      const endShape = editor.getShape(endBinding.toId)
      if (endShape != null) {
        getLinkedShapeIdsOf(endShape, editor).forEach((id) => shapeIds.add(id))
      }
    }
  } else if (shape.type === ActorShapeUtil.type) {
    getCommentShapeIdsLinkedTo(shape, editor).forEach((id) => shapeIds.add(id))
  } else if (shape.type === WorkObjectShapeUtil.type) {
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

function getCommentShapeIdsLinkedTo(shape: TLShape, editor: Editor): TLShapeId[] {
  const commentIds: TLShapeId[] = []
  const bindings = editor
    .getBindingsToShape(shape, 'arrow')
    .filter((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')

  bindings.forEach((binding) => {
    const arrow = editor.getShape(binding.fromId)
    if (arrow) {
      const endBinding = editor
        .getBindingsFromShape(arrow, 'arrow')
        .find((b) => (b.props as TLArrowBindingProps).terminal === 'end')
      if (endBinding) {
        const endShape = editor.getShape(endBinding.toId)
        if (endShape?.type === CommentShapeUtil.type) {
          commentIds.push(arrow.id, endShape.id)
        }
      }
    }
  })
  return commentIds
}
