import { track, useEditor } from 'tldraw';
import { useEffect, useState } from 'react';
import { SHAPE_SIZE } from './shapes/shapes-constants';
import { MoveUpRightIcon } from 'lucide-react';

export const ShapeMenu = track(function ShapeMenu() {
  const editor = useEditor();
  const selectedShape = editor.getOnlySelectedShape();
  const isMouseDown = useMouseDown(); // trick because isDragging is not observable
  const isDragging = editor.inputs.isDragging;

  if (selectedShape == null) {
    return null;
  }

  const selectedShapeScreenPoint = editor.pageToScreen({
    x: selectedShape.x,
    y: selectedShape.y,
  });

  return isDragging || isMouseDown ? null : (
    <div
      className="absolute w-10 h-10 bg-background"
      style={{
        left: selectedShapeScreenPoint.x + SHAPE_SIZE + 5,
        top: selectedShapeScreenPoint.y,
      }}
    >
      <MoveUpRightIcon size={20} className="text-foreground" />
    </div>
  );
});

const useMouseDown = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return isMouseDown;
};
