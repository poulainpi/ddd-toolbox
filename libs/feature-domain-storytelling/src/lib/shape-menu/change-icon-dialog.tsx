import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@ddd-toolbox/ui'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { IconName } from 'lucide-react/dynamic'

export interface ChangeIconDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  icons: string[]
  shapeTypeName: string
  onIconSelect: (icon: string) => void
}

export function ChangeIconDialog({ open, onOpenChange, icons, shapeTypeName, onIconSelect }: ChangeIconDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change {shapeTypeName} Icon</DialogTitle>
          <DialogDescription>Select an icon to change to</DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-wrap gap-1">
          {icons.map((icon) => (
            <Button
              key={icon}
              variant="ghost"
              size="icon"
              className="[&_svg]:size-6"
              onClick={() => onIconSelect(icon)}
            >
              <LoadableIcon name={icon as IconName} />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
