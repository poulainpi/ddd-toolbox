import { Box, BoundsSnapPoint, createShapeId, StateNode, TLShapeId, Vec } from 'tldraw'

export abstract class PreviewPlacementOnCreateToolUtil extends StateNode {
  protected shapeId: TLShapeId | undefined
  protected initialPageBounds: Box | undefined
  protected initialSnapPoints: BoundsSnapPoint[] = []
  protected originPagePoint: Vec | undefined
  protected entryInfo: Record<string, unknown> = {}

  override onEnter(info: Record<string, unknown>) {
    this.handleEnter(info)
    this.entryInfo = info
    this.editor.setCursor({ type: 'cross' })

    if (!isTouchDevice()) {
      // Create shape immediately at cursor position
      const { currentPagePoint } = this.editor.inputs
      this.shapeId = createShapeId()
      this.originPagePoint = currentPagePoint.clone()

      this.createShape(this.shapeId, currentPagePoint, this.getShapeProps(info))

      // Capture initial snap state for snap calculations
      const shape = this.editor.getShape(this.shapeId)
      if (shape) {
        this.initialPageBounds = this.editor.getShapePageBounds(shape.id)
        this.initialSnapPoints = this.editor.snaps.shapeBounds.getSnapPoints(shape.id)
      }

      // Select the shape to exclude it from snap targets
      this.editor.setSelectedShapes([this.shapeId])
    }
  }

  override onPointerMove() {
    if (!this.shapeId || !this.initialPageBounds || !this.originPagePoint) return

    const { currentPagePoint, ctrlKey, pointerVelocity } = this.editor.inputs
    const size = this.getShapeSize()

    // Calculate the raw delta from origin
    const delta = Vec.Sub(currentPagePoint, this.originPagePoint)

    // Clear previous snap indicators
    this.editor.snaps.clearIndicators()

    // Check if snapping should be applied
    const isSnapMode = this.editor.user.getIsSnapMode()
    const isSnapping = isSnapMode ? !ctrlKey : ctrlKey

    if (isSnapping && pointerVelocity.len() < 0.5) {
      // Apply snapping (shape is selected in onEnter, so excluded from snap calculations)
      const { nudge } = this.editor.snaps.shapeBounds.snapTranslateShapes({
        dragDelta: delta,
        initialSelectionPageBounds: this.initialPageBounds,
        initialSelectionSnapPoints: this.initialSnapPoints,
        lockedAxis: null,
      })

      delta.add(nudge)
    }

    // Apply the final position (origin + delta, centered on cursor)
    const newPosition = Vec.Add(this.originPagePoint, delta)

    // Update shape position to follow cursor (with snap correction)
    this.editor.updateShapes([
      {
        id: this.shapeId,
        type: this.getShapeType(),
        x: newPosition.x - size.width / 2,
        y: newPosition.y - size.height / 2,
      },
    ])
  }

  override onPointerDown() {
    if (isTouchDevice() && !this.shapeId) {
      const { currentPagePoint } = this.editor.inputs
      const id = createShapeId()

      this.createShape(id, currentPagePoint, this.getShapeProps(this.entryInfo))

      this.onShapePlaced(id)
      return
    }

    if (!this.shapeId) return

    // Finalize placement and run custom post-placement logic
    this.onShapePlaced(this.shapeId)

    // Clean up
    this.shapeId = undefined
  }

  override onExit() {
    this.editor.snaps.clearIndicators()
    this.initialPageBounds = undefined
    this.initialSnapPoints = []
    this.originPagePoint = undefined
  }

  override onCancel() {
    // Delete unplaced shape if it exists
    if (this.shapeId) {
      this.editor.deleteShape(this.shapeId)
      this.shapeId = undefined
    }
    this.editor.snaps.clearIndicators()
    this.editor.setCurrentTool('select')
  }

  private createShape(id: TLShapeId, position: Vec, props: Record<string, unknown>): void {
    const size = this.getShapeSize()

    this.editor.createShape({
      id,
      type: this.getShapeType(),
      x: position.x - size.width / 2,
      y: position.y - size.height / 2,
      props,
    })
  }

  /**
   * Called during onEnter to allow subclasses to handle custom initialization.
   * Override this to store custom state from the info parameter.
   */
  protected handleEnter(_info: Record<string, unknown>): void {
    // Default: no-op, subclasses can override
  }

  /**
   * Return the tldraw shape type (e.g., 'actor', 'comment', 'sticky-note')
   */
  protected abstract getShapeType(): string

  /**
   * Return the shape dimensions for centering on cursor
   */
  protected abstract getShapeSize(): { width: number; height: number }

  /**
   * Return the shape-specific props to pass to createShape
   */
  protected abstract getShapeProps(info: Record<string, unknown>): Record<string, unknown>

  /**
   * Called after shape is placed. Implement custom logic here:
   * - Arrow creation
   * - Shape grouping
   * - Shape selection/editing
   */
  protected abstract onShapePlaced(shapeId: TLShapeId): void
}

function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}
