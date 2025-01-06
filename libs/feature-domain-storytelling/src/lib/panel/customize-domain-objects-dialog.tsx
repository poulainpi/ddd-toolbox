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
  LoadableIcon,
  Separator,
  toast,
  ToastAction,
} from '@ddd-toolbox/ui'
import { PlusIcon, SettingsIcon } from 'lucide-react'
import { cn } from '@ddd-toolbox/util'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { UseWorkObjectsReturn } from '../states/use-work-objects'
import { useForm } from 'react-hook-form'
import { UseActorsReturn } from '../states/use-actors'

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
          className="[&_svg]:size-5 text-foreground absolute bottom-0 left-0 right-0 w-full"
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
              <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer">
                here
              </a>
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-lg">Actors</span>
            <AddDomainObjectForm
              alreadyUsedDomainObjects={actors}
              onDomainObjectAdded={(actor: string) => actorsState.addActor(actor)}
            />
          </div>

          <div className="flex mt-2">
            {actors.map((actor) => (
              <DeleteDomainObjectButton
                key={actor}
                icon={actor}
                onClick={() => {
                  const oldActors = [...actors]
                  toast({
                    title: `Actor "${actor}" deleted`,
                    action: (
                      <ToastAction altText="Undo the actor deletion" onClick={() => actorsState.setActors(oldActors)}>
                        Undo
                      </ToastAction>
                    ),
                  })
                  actorsState.deleteActor(actor)
                }}
              />
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg">Work Objects</span>
            <AddDomainObjectForm
              alreadyUsedDomainObjects={workObjects}
              onDomainObjectAdded={(workObject: string) => workObjectsState.addWorkObject(workObject)}
            />
          </div>

          <div className="flex mt-2">
            {workObjects.map((workObject) => (
              <DeleteDomainObjectButton
                key={workObject}
                icon={workObject}
                onClick={() => {
                  const oldWorkObjects = [...workObjects]
                  toast({
                    title: `Work Object "${workObject}" deleted`,
                    action: (
                      <ToastAction
                        altText="Undo the work object deletion"
                        onClick={() => workObjectsState.setWorkObjects(oldWorkObjects)}
                      >
                        Undo
                      </ToastAction>
                    ),
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
      className={cn('[&_svg]:size-6 hover:text-destructive-foreground hover:bg-destructive/90')}
      onClick={onClick}
    >
      <LoadableIcon name={icon as keyof typeof dynamicIconImports} />
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
    } else if (dynamicIconImports[icon as keyof typeof dynamicIconImports] === undefined) {
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
