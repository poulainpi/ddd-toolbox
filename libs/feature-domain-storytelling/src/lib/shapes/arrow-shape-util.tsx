import { ArrowShapeUtil as DefaultArrowShapeUtil, TLArrowBindingProps, TLArrowShape, toRichText } from 'tldraw'
import { ActorShapeUtil } from './actor-shape-util'
import { getActivitiesArrows } from './activities-arrows'
import { toPlainText } from '@ddd-toolbox/shared-canvas'

export class ArrowShapeUtil extends DefaultArrowShapeUtil {
  override onEditEnd(arrow: TLArrowShape) {
    const shapeAtStart = this.editor
      .getBindingsFromShape(arrow, 'arrow')
      .find((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')?.toId

    if (shapeAtStart == null || this.editor.getShape(shapeAtStart)?.type !== ActorShapeUtil.type) {
      this.trimEndOfTextOf(arrow)
      return
    }

    const newActivityNumber = this.parseActivityNumber(toPlainText(this.editor, arrow.props.richText))
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

    const newActivityNumber = this.findNextActivityNumber(activitiesNumbers)
    this.updateWithActivityNumber(shape, newActivityNumber)
  }

  private findNextActivityNumber(existingActivityNumbers: number[]) {
    const sortedNumbers = [...new Set(existingActivityNumbers)].sort((a, b) => a - b)

    for (let i = 0; i < sortedNumbers.length; i++) {
      if (sortedNumbers[i] !== i + 1) {
        return i + 1 // Return the first missing number
      }
    }

    return sortedNumbers.length + 1 // If no missing number, return the next number
  }

  private updateWithActivityNumber(shape: TLArrowShape, activityNumber: number) {
    this.editor.updateShapes<TLArrowShape>([
      {
        id: shape.id,
        type: shape.type,
        props: {
          richText: toRichText(`${activityNumber}. ${toPlainText(this.editor, shape.props.richText).trimEnd()}`),
        },
        meta: {
          activityNumber: activityNumber,
        },
      },
    ])
  }

  private updateArrowsActivityNumberBasedOnChangedArrow(arrow: TLArrowShape) {
    const activitiesArrows = getActivitiesArrows(this.editor)
    const newActivityNumber = this.parseActivityNumber(toPlainText(this.editor, arrow.props.richText))
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

            const currentText = toPlainText(this.editor, currentArrow.props.richText)
            const textWithoutNumber = currentText.substring(currentText.indexOf('.') + 2)

            return {
              id: currentArrow.id,
              type: currentArrow.type,
              props: {
                richText: toRichText(`${updatedActivityNumber}. ${textWithoutNumber}`),
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
    const currentText = toPlainText(this.editor, arrow.props.richText)
    if (currentText.trimEnd() !== currentText) {
      this.editor.updateShapes<TLArrowShape>([
        {
          id: arrow.id,
          type: arrow.type,
          props: {
            richText: toRichText(currentText.trimEnd()),
          },
        },
      ])
    }
  }
}
