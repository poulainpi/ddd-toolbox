import { track, useEditor } from 'tldraw'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '@ddd-toolbox/ui'

export const ZoomPanel = track(function ZoomPanel() {
  const editor = useEditor()

  function zoomOut() {
    editor.zoomOut(undefined, {
      animation: { duration: editor.options.animationMediumMs },
    })
  }

  function zoomIn() {
    editor.zoomIn(undefined, {
      animation: { duration: editor.options.animationMediumMs },
    })
  }

  function resetZoom() {
    editor.resetZoom(undefined, {
      animation: { duration: editor.options.animationMediumMs },
    })
  }

  return (
    <div className="absolute bottom-0 left-0 bg-muted/50 p-1 items-center hidden md:flex">
      <Button variant="ghost" size="icon" onClick={zoomOut}>
        <MinusIcon />
      </Button>
      <Button variant="ghost" size="sm" className="w-16" onClick={resetZoom}>
        {Math.floor(editor.getZoomLevel() * 100)}%
      </Button>
      <Button variant="ghost" size="icon" onClick={zoomIn}>
        <PlusIcon />
      </Button>
    </div>
  )
})
