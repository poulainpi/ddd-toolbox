import { ArrowShapeUtil as DefaultArrowShapeUtil, TLArrowBindingProps, TLArrowShape } from 'tldraw'
import { ActorShapeUtil } from './actor-shape-util'
import { getActivitiesArrows } from './activities-arrows'

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
      if (arrow.meta.activityNumber == null) {
        this.initializeActivityNumberOf(arrow)
      } else {
        this.updateWithActivityNumber(arrow, arrow.meta.activityNumber as number)
      }
      return
    }

    if (newActivityNumber === arrow.meta.activityNumber) {
      this.trimEndOfTextOf(arrow)
      return
    }

    this.updateArrowsActivityNumberBasedOnChangedArrow(arrow)
  }

  private parseActivityNumber(text: string) {
    return Number.parseInt(text.split('.')[0])
  }

  private initializeActivityNumberOf(shape: TLArrowShape) {
    const activitiesArrows = getActivitiesArrows(this.editor)
    const activitiesNumbers = activitiesArrows
      .map((shape) => shape.meta.activityNumber as number)
      .filter(Number.isInteger)

    const newActivityNumber = Math.max(0, ...activitiesNumbers) + 1
    this.updateWithActivityNumber(shape, newActivityNumber)
  }

  private updateWithActivityNumber(shape: TLArrowShape, activityNumber: number) {
    this.editor.updateShapes<TLArrowShape>([
      {
        id: shape.id,
        type: shape.type,
        props: {
          text: `${activityNumber}. ${shape.props.text.trimEnd()}`,
        },
        meta: {
          activityNumber: activityNumber,
        },
      },
    ])
  }

  private updateArrowsActivityNumberBasedOnChangedArrow(arrow: TLArrowShape) {
    const activitiesArrows = getActivitiesArrows(this.editor)
    const newActivityNumber = this.parseActivityNumber(arrow.props.text)
    const arrowWithSameActivityNumber = activitiesArrows.find(
      (currentArrow) => currentArrow.meta.activityNumber === newActivityNumber && currentArrow.id !== arrow.id,
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
                  currentArrow.props.text.indexOf('.') + 2,
                )}`,
              },
              meta: {
                activityNumber: updatedActivityNumber,
              },
            }
          }),
      )
    } else {
      this.editor.updateShape({
        id: arrow.id,
        type: arrow.type,
        meta: {
          activityNumber: newActivityNumber,
        },
      })
    }
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
}
