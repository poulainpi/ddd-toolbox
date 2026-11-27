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
import { useT } from '@ddd-toolbox/i18n'

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
  const t = useT()
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
            {isNew ? t('canvas.changeNameNew', { type }) : t('canvas.changeNameEdit', { type })}
          </DialogTitle>
          <DialogDescription>
            {isNew ? t('canvas.changeNameDefine', { type }) : t('canvas.changeNameChange', { type })}
          </DialogDescription>
        </DialogHeader>

        <ChangeNameForm initialName={name} onSubmit={onSubmit} formId={formId} helperComponent={HelperComponent} />

        <DialogFooter>
          <Button type="submit" form={formId}>
            {isNew ? t('common.create') : t('common.confirm')}
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
  const t = useT()
  const form = useForm({ defaultValues: { name: initialName } })

  return (
    <Form form={form} onSubmit={(data) => onSubmit(data.name)} id={formId}>
      <FormInput name="name" label={t('common.name')} autoComplete="off" />
      {HelperComponent && <HelperComponent form={form} />}
    </Form>
  )
}
