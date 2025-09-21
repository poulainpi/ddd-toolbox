import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormInput,
  Separator,
} from '@ddd-toolbox/ui'
import { toast } from 'sonner'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { PlusIcon, SettingsIcon } from 'lucide-react'
import { cn } from '@ddd-toolbox/util'
import { UseWorkObjectsReturn } from '../states/use-work-objects'
import { useForm } from 'react-hook-form'
import { UseActorsReturn } from '../states/use-actors'
import { dynamicIconImports, IconName } from 'lucide-react/dynamic'

export interface CustomizeDomainObjectsDialogProps {
  actorsState: UseActorsReturn
  workObjectsState: UseWorkObjectsReturn
}

export function CustomizeDomainObjectsDialog({ actorsState, workObjectsState }: CustomizeDomainObjectsDialogProps) {
  const actors = actorsState.actors
  const workObjects = workObjectsState.workObjects
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground absolute right-0 bottom-0 left-0 w-full [&_svg]:size-5"
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Icon Set</DialogTitle>
          <DialogDescription>
            You can find the list of available icons{' '}
            <Button variant="link" asChild className="p-0">
              <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer">
                here
              </a>
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-lg">Actors</span>
            <AddDomainObjectForm
              alreadyUsedDomainObjects={actors}
              onDomainObjectAdded={(actor: string) => actorsState.addActor(actor)}
            />
          </div>

          <div className="mt-2 flex flex-wrap">
            {actors.map((actor) => (
              <DeleteDomainObjectButton
                key={actor}
                icon={actor}
                onClick={() => {
                  const oldActors = [...actors]
                  toast(`Actor "${actor}" deleted`, {
                    action: {
                      label: 'Undo',
                      onClick: () => actorsState.setActors(oldActors),
                    },
                  })
                  actorsState.deleteActor(actor)
                }}
              />
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="text-lg">Work Objects</span>
            <AddDomainObjectForm
              alreadyUsedDomainObjects={workObjects}
              onDomainObjectAdded={(workObject: string) => workObjectsState.addWorkObject(workObject)}
            />
          </div>

          <div className="mt-2 flex flex-wrap">
            {workObjects.map((workObject) => (
              <DeleteDomainObjectButton
                key={workObject}
                icon={workObject}
                onClick={() => {
                  const oldWorkObjects = [...workObjects]
                  toast(`Work Object "${workObject}" deleted`, {
                    action: {
                      label: 'Undo',
                      onClick: () => workObjectsState.setWorkObjects(oldWorkObjects),
                    },
                  })
                  workObjectsState.deleteWorkObject(workObject)
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDomainObjectButton({ icon, onClick }: { icon: string; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('hover:text-destructive-foreground hover:bg-destructive/90 [&_svg]:size-6')}
      onClick={onClick}
    >
      <LoadableIcon name={icon as IconName} />
    </Button>
  )
}

function AddDomainObjectForm({
  alreadyUsedDomainObjects,
  onDomainObjectAdded,
}: {
  alreadyUsedDomainObjects: string[]
  onDomainObjectAdded: (icon: string) => void
}) {
  const form = useForm({ defaultValues: { icon: '' } })

  function onSubmit({ icon }: { icon: string }) {
    if (alreadyUsedDomainObjects.includes(icon)) {
      form.setError('icon', { message: `"${icon}" is already used` })
    } else if (dynamicIconImports[icon as IconName] === undefined) {
      form.setError('icon', { message: 'Icon not found' })
    } else {
      form.setValue('icon', '')
      onDomainObjectAdded(icon)
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="flex gap-2">
      <FormInput name="icon" placeholder="Icon name" />
      <Button type="submit" variant="outline">
        <PlusIcon />
      </Button>
    </Form>
  )
}
