import { Atom, getArrowBindings, StateNode, TLArrowBindingProps, TLArrowShape, TLShape, TLShapeId } from 'tldraw'
import { getActivitiesArrows } from '../shapes/activities-arrows'
import { ActorShapeUtil } from '../shapes/actor-shape-util'

export class PlayStoryToolUtil extends StateNode {
  static override id = 'play-story'

  private currentStep = 0
  private hiddenShapeIds: Map<TLShapeId, boolean> = new Map()
  private activitiesArrows: TLArrowShape[] = []
  private storyChangedUpdater: Atom<number, unknown> | undefined
  private appearedShapeIds: TLShapeId[][] = []

  override onEnter() {
    this.editor.updateInstanceState({ isReadonly: true })
    this.initializeIfNeeded()
  }

  override onExit() {
    this.editor.updateInstanceState({ isReadonly: false })
    this.currentStep = 0
    this.hiddenShapeIds = new Map()
  }

  public isHidden(shape: TLShape, storyChangedUpdater: Atom<number, unknown>): boolean {
    this.storyChangedUpdater = storyChangedUpdater
    storyChangedUpdater.get()

    this.initializeIfNeeded()
    return this.hiddenShapeIds.get(shape.id) ?? false
  }

  public stepBackward() {
    if (this.currentStep === 1) return
    ;(this.appearedShapeIds.pop() ?? []).forEach((shapeId) => {
      this.hiddenShapeIds.set(shapeId, true)
    })
    this.updateIsHiddenFunction()
    this.currentStep--
  }

  public stepForward() {
    if (this.currentStep === this.getStepsCount()) return

    this.currentStep++
    const appearedShapeIds = [] as TLShapeId[]

    this.getShapeIdsAtStep(this.currentStep).forEach((shapeId) => {
      if (this.hiddenShapeIds.get(shapeId) === true) {
        this.hiddenShapeIds.set(shapeId, false)
        appearedShapeIds.push(shapeId)
      }
    })

    this.appearedShapeIds.push(appearedShapeIds)

    this.updateIsHiddenFunction()
  }

  public getCurrentStep(): number {
    return this.currentStep
  }

  public getStepsCount(): number {
    return this.activitiesArrows.length
  }

  private getShapeIdsAtStep(step: number): TLShapeId[] {
    return this.activitiesArrows
      .filter((arrow) => arrow.meta.activityNumber === step)
      .map((arrow) => [arrow.id, ...this.getLinkedShapeIdsOf(arrow)])
      .flat()
  }

  private getLinkedShapeIdsOf(shape: TLShape): TLShapeId[] {
    if (shape.type === ActorShapeUtil.type) {
      return [shape.id]
    }

    const shapeIds = new Set<TLShapeId>([shape.id])

    if (shape.type === 'arrow') {
      const { start: startBinding, end: endBinding } = getArrowBindings(this.editor, shape as TLArrowShape)
      if (startBinding != null) {
        shapeIds.add(startBinding.toId)
      }

      if (endBinding != null) {
        const endShape = this.editor.getShape(endBinding.toId)
        if (endShape != null) {
          this.getLinkedShapeIdsOf(endShape).forEach((id) => shapeIds.add(id))
        }
      }
    } else {
      const bindings = this.editor
        .getBindingsToShape(shape, 'arrow')
        .filter((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')

      bindings.forEach((binding) => {
        const startArrow = this.editor.getShape(binding.fromId)
        if (startArrow != null) {
          this.getLinkedShapeIdsOf(startArrow).forEach((id) => shapeIds.add(id))
        }
      })
    }

    return Array.from(shapeIds)
  }

  private initializeIfNeeded() {
    if (this.hiddenShapeIds.size === 0) {
      this.activitiesArrows = getActivitiesArrows(this.editor)
      this.hiddenShapeIds = new Map(Array.from(this.editor.getCurrentPageShapeIds().values(), (id) => [id, true]))
      this.stepForward()
    }
  }

  private updateIsHiddenFunction() {
    this.storyChangedUpdater?.set(this.storyChangedUpdater.get() + 1)
  }
}
