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
import { useDocumentName } from '../hooks/use-document-name'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

export interface ChangeDocumentNameDialogProps {
  disclosure: UseDisclosureReturn
  isNew: boolean
  documentType?: string
}

export function ChangeDocumentNameDialog({
  disclosure,
  isNew,
  documentType = 'document',
}: ChangeDocumentNameDialogProps) {
  const { documentName, setDocumentName } = useDocumentName()

  function onSubmit(newName: string) {
    setDocumentName(newName)
    disclosure.close()
  }

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'New' : 'Edit'} {documentType} name
          </DialogTitle>
          <DialogDescription>
            {isNew ? 'Create' : 'Change'} the name of your {documentType} here.
          </DialogDescription>
        </DialogHeader>

        <ChangeDocumentNameForm initialName={documentName} onSubmit={onSubmit} />

        <DialogFooter>
          <Button type="submit" form="document-name">
            {isNew ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ChangeDocumentNameForm({
  initialName,
  onSubmit,
}: {
  initialName: string
  onSubmit: (newName: string) => void
}) {
  const form = useForm({ defaultValues: { name: initialName } })

  return (
    <Form form={form} onSubmit={(data) => onSubmit(data.name)} id="document-name">
      <FormInput name="name" label="Name" />
    </Form>
  )
}
