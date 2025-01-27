import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormInput,
} from '@ddd-toolbox/ui'
import { useForm } from 'react-hook-form'
import { useStoryName } from '../states/use-story-name'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

export interface StoryNameProps {
  disclosure: UseDisclosureReturn
  isNewStory: boolean
}

export function ChangeStoryNameDialog({ disclosure, isNewStory }: StoryNameProps) {
  const { storyName, setStoryName } = useStoryName()

  function onSubmit(newName: string) {
    setStoryName(newName)
    disclosure.close()
  }

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNewStory ? 'New' : 'Edit'} story name </DialogTitle>
          <DialogDescription>{isNewStory ? 'Create' : 'Change'} the name of your story here.</DialogDescription>
        </DialogHeader>

        <ChangeStoryNameForm initialName={storyName} onSubmit={onSubmit} />

        <DialogFooter>
          <Button type="submit" form="story-name">
            {isNewStory ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ChangeStoryNameForm({
  initialName,
  onSubmit,
}: {
  initialName: string
  onSubmit: (newName: string) => void
}) {
  const form = useForm({ defaultValues: { name: initialName } })

  return (
    <Form form={form} onSubmit={(data) => onSubmit(data.name)} id="story-name">
      <FormInput name="name" label="Name" />
    </Form>
  )
}
