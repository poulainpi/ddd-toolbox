import { ArrowShapeUtil as DefaultArrowShapeUtil, TLArrowShape } from 'tldraw'
import { ActorShapeUtil } from './actor-shape-util'

export class ArrowShapeUtil extends DefaultArrowShapeUtil {
  override onEditEnd(shape: TLArrowShape) {
    const {
      id,
      type,
      props: { text },
    } = shape

    const activitiesArrows = this.getActivitiesArrows()
    const activitiesNumbers = activitiesArrows
      .map((shape) => shape.meta.activityNumber as number)
      .filter(Number.isInteger)

    let newActivityNumber = this.parseActivityNumber(text)
    if (!Number.isInteger(newActivityNumber)) {
      newActivityNumber = Math.max(0, ...activitiesNumbers) + 1
      this.editor.updateShapes<TLArrowShape>([
        {
          id,
          type,
          props: {
            text: `${newActivityNumber}. ${text.trimEnd()}`,
          },
          meta: {
            activityNumber: newActivityNumber,
          },
        },
      ])

      return
    }

    const arrowWithSameActivityNumber = activitiesArrows.find(
      (currentArrow) => currentArrow.meta.activityNumber === newActivityNumber && currentArrow.id !== shape.id
    )
    if (arrowWithSameActivityNumber != null) {
      const oldActivityNumber = shape.meta.activityNumber as number

      this.editor.updateShapes<TLArrowShape>(
        activitiesArrows
          .filter((currentArrow) => {
            const currentActivityNumber = currentArrow.meta.activityNumber as number
            return (
              currentArrow.id === shape.id ||
              (currentActivityNumber >= newActivityNumber &&
                (newActivityNumber > oldActivityNumber || currentActivityNumber < oldActivityNumber))
            )
          })
          .map((currentArrow) => {
            const updatedActivityNumber =
              currentArrow.id === shape.id ? newActivityNumber : (currentArrow.meta.activityNumber as number) + 1

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

      return
    }

    if (text.trimEnd() !== shape.props.text) {
      this.editor.updateShapes<TLArrowShape>([
        {
          id,
          type,
          props: {
            text: text.trimEnd(),
          },
        },
      ])
    }
  }

  private parseActivityNumber(text: string) {
    return Number.parseInt(text.split('.')[0])
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
