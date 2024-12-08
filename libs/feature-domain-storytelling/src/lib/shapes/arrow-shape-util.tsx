import { ArrowShapeUtil as DefaultArrowShapeUtil, TLArrowBindingProps, TLArrowShape } from 'tldraw'
import { ActorShapeUtil } from './actor-shape-util'

export class ArrowShapeUtil extends DefaultArrowShapeUtil {
  override onEditEnd(arrow: TLArrowShape) {
    const shapeAtStart = this.editor
      .getBindingsFromShape(arrow, 'arrow')
      .find((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')?.toId

    if (shapeAtStart == null || this.editor.getShape(shapeAtStart)?.type !== ActorShapeUtil.type) {
      this.trimEndOfTextOf(arrow)
      return
    }

    const newActivityNumber = this.parseActivityNumber(arrow.props.text)
    if (!Number.isInteger(newActivityNumber)) {
      this.initializeActivityNumberOf(arrow)
      return
    }

    const thereWasANeedForAnUpdate = this.updateOtherArrowsActivityNumberIfNeeded(arrow)
    if (!thereWasANeedForAnUpdate) {
      this.trimEndOfTextOf(arrow)
    }
  }

  private parseActivityNumber(text: string) {
    return Number.parseInt(text.split('.')[0])
  }

  private initializeActivityNumberOf(shape: TLArrowShape) {
    const activitiesArrows = this.getActivitiesArrows()
    const activitiesNumbers = activitiesArrows
      .map((shape) => shape.meta.activityNumber as number)
      .filter(Number.isInteger)

    const newActivityNumber = Math.max(0, ...activitiesNumbers) + 1
    this.editor.updateShapes<TLArrowShape>([
      {
        id: shape.id,
        type: shape.type,
        props: {
          text: `${newActivityNumber}. ${shape.props.text.trimEnd()}`,
        },
        meta: {
          activityNumber: newActivityNumber,
        },
      },
    ])
  }

  private updateOtherArrowsActivityNumberIfNeeded(arrow: TLArrowShape): boolean {
    const activitiesArrows = this.getActivitiesArrows()
    const newActivityNumber = this.parseActivityNumber(arrow.props.text)
    const arrowWithSameActivityNumber = activitiesArrows.find(
      (currentArrow) => currentArrow.meta.activityNumber === newActivityNumber && currentArrow.id !== arrow.id
    )

    if (arrowWithSameActivityNumber != null) {
      const oldActivityNumber = arrow.meta.activityNumber as number

      this.editor.updateShapes<TLArrowShape>(
        activitiesArrows
          .filter((currentArrow) => {
            const currentActivityNumber = currentArrow.meta.activityNumber as number
            return (
              currentArrow.id === arrow.id ||
              (currentActivityNumber >= newActivityNumber &&
                (newActivityNumber > oldActivityNumber || currentActivityNumber < oldActivityNumber))
            )
          })
          .map((currentArrow) => {
            const updatedActivityNumber =
              currentArrow.id === arrow.id ? newActivityNumber : (currentArrow.meta.activityNumber as number) + 1

            return {
              id: currentArrow.id,
              type: currentArrow.type,
              props: {
                text: `${updatedActivityNumber}. ${currentArrow.props.text.substring(
                  currentArrow.props.text.indexOf('.') + 2
                )}`,
              },
              meta: {
                activityNumber: updatedActivityNumber,
              },
            }
          })
      )
      return true
    }
    return false
  }

  private trimEndOfTextOf(arrow: TLArrowShape) {
    if (arrow.props.text.trimEnd() !== arrow.props.text) {
      this.editor.updateShapes<TLArrowShape>([
        {
          id: arrow.id,
          type: arrow.type,
          props: {
            text: arrow.props.text.trimEnd(),
          },
        },
      ])
    }
  }

  private getActivitiesArrows(): TLArrowShape[] {
    const bindingsOnActors = this.editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === ActorShapeUtil.type)
      .map((shape) => this.editor.getBindingsInvolvingShape(shape, 'arrow'))
      .flat()

    return bindingsOnActors
      .map((binding) => this.editor.getShape(binding.fromId))
      .filter((shape) => shape?.type === ArrowShapeUtil.type) as TLArrowShape[]
  }
}
