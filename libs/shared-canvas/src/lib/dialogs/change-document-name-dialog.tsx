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
import { useForm, UseFormReturn } from 'react-hook-form'
import { useDocumentName } from '../hooks/use-document-name'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

export interface ChangeDocumentNameDialogProps {
  disclosure: UseDisclosureReturn
  isNew: boolean
  documentType?: string
  helperComponent?: React.ComponentType<{ form: UseFormReturn<{ name: string }> }>
}

export function ChangeDocumentNameDialog({
  disclosure,
  isNew,
  documentType = 'document',
  helperComponent: HelperComponent,
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

        <ChangeDocumentNameForm initialName={documentName} onSubmit={onSubmit} helperComponent={HelperComponent} />

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
  helperComponent: HelperComponent,
}: {
  initialName: string
  onSubmit: (newName: string) => void
  helperComponent?: React.ComponentType<{ form: UseFormReturn<{ name: string }> }>
}) {
  const form = useForm({ defaultValues: { name: initialName } })

  return (
    <Form form={form} onSubmit={(data) => onSubmit(data.name)} id="document-name">
      <FormInput name="name" label="Name" />
      {HelperComponent && <HelperComponent form={form} />}
    </Form>
  )
}
