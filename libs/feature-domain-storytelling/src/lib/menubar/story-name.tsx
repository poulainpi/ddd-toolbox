import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormInput,
} from '@ddd-toolbox/ui'
import { useForm } from 'react-hook-form'
import { useEditor, useValue } from 'tldraw'

export function StoryName() {
  const editor = useEditor()
  const name = useValue('name', () => editor.getDocumentSettings().name || 'untitled', [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit story name</DialogTitle>
          <DialogDescription>Change the name of your story here.</DialogDescription>
        </DialogHeader>

        <ChangeStoryNameForm
          initialName={name}
          onSubmit={(newName) => editor.updateDocumentSettings({ name: newName })}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" form="story-name">
              Save
            </Button>
          </DialogClose>
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
