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
import { usePageName } from '../hooks/use-page-name'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

export interface ChangeNameDialogProps {
  mode: 'document' | 'page'
  type: string
  disclosure: UseDisclosureReturn
  isNew: boolean
  helperComponent?: React.ComponentType<{ form: UseFormReturn<{ name: string }> }>
  onConfirm?: (name: string) => void
}

export function ChangeNameDialog({
  mode,
  type,
  disclosure,
  isNew,
  helperComponent: HelperComponent,
  onConfirm,
}: ChangeNameDialogProps) {
  const documentNameHook = useDocumentName()
  const pageNameHook = usePageName()

  const { name, setName } =
    mode === 'document'
      ? { name: documentNameHook.documentName, setName: documentNameHook.setDocumentName }
      : { name: pageNameHook.pageName, setName: pageNameHook.setPageName }

  const formId = `${mode}-name`

  function onSubmit(newName: string) {
    if (onConfirm) {
      onConfirm(newName)
    } else {
      setName(newName)
    }
    disclosure.close()
  }

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'New' : 'Edit'} {type} name
          </DialogTitle>
          <DialogDescription>
            {isNew ? 'Create' : 'Change'} the name of your {type} here.
          </DialogDescription>
        </DialogHeader>

        <ChangeNameForm initialName={name} onSubmit={onSubmit} formId={formId} helperComponent={HelperComponent} />

        <DialogFooter>
          <Button type="submit" form={formId}>
            {isNew ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ChangeNameForm({
  initialName,
  onSubmit,
  formId,
  helperComponent: HelperComponent,
}: {
  initialName: string
  onSubmit: (newName: string) => void
  formId: string
  helperComponent?: React.ComponentType<{ form: UseFormReturn<{ name: string }> }>
}) {
  const form = useForm({ defaultValues: { name: initialName } })

  return (
    <Form form={form} onSubmit={(data) => onSubmit(data.name)} id={formId}>
      <FormInput name="name" label="Name" autoComplete="off" />
      {HelperComponent && <HelperComponent form={form} />}
    </Form>
  )
}
