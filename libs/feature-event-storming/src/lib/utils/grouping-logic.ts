import { createShapeId, Editor, GroupShapeUtil, TLGroupShape, TLShape, TLShapeId } from 'tldraw'

export function groupStickyNoteWithANewOne(editor: Editor, existingShape: TLShape, newShapeId: TLShapeId): void {
  const existingGroup = findGroup(editor, existingShape.id)

  if (existingGroup) {
    joinExistingGroup(editor, existingGroup, newShapeId)
  } else {
    createNewGroup(editor, existingShape.id, newShapeId)
  }
}

function findGroup(editor: Editor, shapeId: TLShapeId): TLGroupShape | null {
  const shape = editor.getShape(shapeId)
  if (!shape || !shape.parentId) {
    return null
  }

  if (shape.type === GroupShapeUtil.type) {
    return shape as TLGroupShape
  }

  const parent = editor.getShape(shape.parentId)
  if (parent && parent.type === GroupShapeUtil.type) {
    return parent as TLGroupShape
  }

  return null
}

function joinExistingGroup(editor: Editor, group: TLGroupShape, newShapeId: TLShapeId): void {
  editor.reparentShapes([newShapeId], group.id)
}

function createNewGroup(editor: Editor, existingShapeId: TLShapeId, newShapeId: TLShapeId): void {
  const groupId = createShapeId()

  editor.createShape({
    id: groupId,
    type: 'group',
  })

  // Avoid editor.groupShapes as it prevents newly created sticky notes from entering editing mode
  editor.reparentShapes([existingShapeId, newShapeId], groupId)
}
