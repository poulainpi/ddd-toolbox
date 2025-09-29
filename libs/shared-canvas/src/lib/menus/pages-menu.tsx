import { PageRecordType, TLPageId, useEditor } from 'tldraw'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ddd-toolbox/ui'
import { Check, Copy, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useDisclosure, UseDisclosureReturn } from '@ddd-toolbox/util'
import { useState } from 'react'

export interface PagesMenuProps {
  ChangePageNameDialogComponent: React.ComponentType<{
    disclosure: UseDisclosureReturn
    isNew: boolean
    onConfirm?: (name: string) => void
  }>
  label?: string
}

export function PagesMenu({ ChangePageNameDialogComponent, label = 'Pages' }: PagesMenuProps) {
  const editor = useEditor()
  const pages = editor.getPages()
  const currentPage = editor.getCurrentPage()
  const createPageDisclosure = useDisclosure()
  const renamePageDisclosure = useDisclosure()
  const duplicatePageDisclosure = useDisclosure()
  const [isOpen, setIsOpen] = useState(false)
  const [pageIdToDuplicate, setPageIdToDuplicate] = useState<TLPageId | null>(null)

  function openCreateNewPage() {
    setIsOpen(false)
    createPageDisclosure.open()
  }

  function createPage(name: string) {
    const newPageId = PageRecordType.createId()
    editor.createPage({ id: newPageId, name })
    editor.setCurrentPage(newPageId)
  }

  function switchToPage(pageId: TLPageId) {
    editor.setCurrentPage(pageId)
  }

  function openRenamePage(pageId: TLPageId) {
    editor.setCurrentPage(pageId)
    renamePageDisclosure.open()
  }

  function openDuplicatePage(pageId: TLPageId) {
    setPageIdToDuplicate(pageId)
    duplicatePageDisclosure.open()
  }

  function duplicatePage(name: string) {
    if (pageIdToDuplicate) {
      const newPageId = PageRecordType.createId()
      editor.duplicatePage(pageIdToDuplicate, newPageId)
      editor.renamePage(newPageId, name)
      editor.setCurrentPage(newPageId)
    }
  }

  function deletePage(pageId: TLPageId) {
    editor.deletePage(pageId)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {currentPage.name}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-56" align="start">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-semibold">{label}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={openCreateNewPage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />

          {pages.map((page) => (
            <div key={page.id} className="group relative flex items-center">
              <DropdownMenuItem className="flex-1 pr-8" onClick={() => switchToPage(page.id)}>
                {page.id === currentPage.id && <Check className="mr-2 h-4 w-4" />}
                {page.id !== currentPage.id && <span className="mr-6" />}
                <span>{page.name}</span>
              </DropdownMenuItem>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem onClick={() => openRenamePage(page.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDuplicatePage(page.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deletePage(page.id)}
                    disabled={pages.length === 1}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePageNameDialogComponent disclosure={createPageDisclosure} isNew={true} onConfirm={createPage} />
      <ChangePageNameDialogComponent disclosure={renamePageDisclosure} isNew={false} />
      <ChangePageNameDialogComponent disclosure={duplicatePageDisclosure} isNew={true} onConfirm={duplicatePage} />
    </>
  )
}
