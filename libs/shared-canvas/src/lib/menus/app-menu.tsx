import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@ddd-toolbox/ui'
import {
  getUserPreferences,
  setUserPreferences,
  TLUserPreferences,
  useEditor,
  useValue,
  getSnapshot,
  useReadonly,
} from 'tldraw'
import { compressToEncodedURIComponent } from 'lz-string'
import {
  ArrowLeftIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileDownIcon,
  FilePlusIcon,
  FolderIcon,
  GithubIcon,
  ImageDownIcon,
  LightbulbIcon,
  LanguagesIcon,
  LinkIcon,
  MenuIcon,
  MonitorSpeakerIcon,
  SettingsIcon,
  SunMoonIcon,
} from 'lucide-react'
import { useDocumentPersistence } from '../hooks/use-document-persistence'
import { track, useDisclosure } from '@ddd-toolbox/util'
import { useLocale, useT, setLocale } from '@ddd-toolbox/i18n'
import { DiscardChangesAlertDialog } from '../dialogs/discard-changes-alert-dialog'
import { useEffect } from 'react'
import { useDocumentName } from '../hooks/use-document-name'
import { toast } from 'sonner'

export interface AppMenuProps {
  newDocument: () => void
  newDocumentLabel?: string
  exampleHref?: string
}

export function AppMenu({ newDocument, newDocumentLabel, exampleHref }: AppMenuProps) {
  const t = useT()
  const locale = useLocale()
  const editor = useEditor()
  const gridModeActivated = useValue('grid mode activated', () => editor.getInstanceState().isGridMode, [])
  const isReadonlyMode = useReadonly()
  const userPreferences = useValue('user preferences', getUserPreferences, [])
  const theme = userPreferences.colorScheme ?? 'system'
  const { latestChangesSaved, open, saveAs } = useDocumentPersistence()
  const confirmDiscardChangesDisclosure = useDisclosure()
  const { documentName } = useDocumentName()

  useEffect(() => {
    editor.user.updateUserPreferences({ locale: locale === 'zh-CN' ? 'zh-cn' : 'en' })
  }, [editor, locale])

  function changeUserPreferences(newPreferences: Partial<TLUserPreferences>) {
    setUserPreferences({
      ...getUserPreferences(),
      ...newPreferences,
    })
  }

  function togglePresentationMode() {
    editor.updateInstanceState({ isReadonly: !isReadonlyMode })
  }

  function checkUnsavedChangesAndOpen() {
    if (latestChangesSaved || editor.getCurrentPageShapes().length === 0) {
      open()
    } else {
      confirmDiscardChangesDisclosure.open()
    }
  }

  function validateCanvasForExport() {
    const shapeIds = editor.getCurrentPageShapeIds()
    if (shapeIds.size === 0) {
      showEmptyCanvasToast()
      return null
    }
    return [...shapeIds]
  }

  function showEmptyCanvasToast() {
    toast.error(t('toast.emptyCanvasTitle'), {
      description: t('toast.emptyCanvasDescription'),
    })
  }

  function downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function trackExportEvent(format: 'svg' | 'png' | 'link') {
    track('canvas-exported', { format })
  }

  async function exportAsSvg() {
    try {
      const shapeIds = validateCanvasForExport()
      if (!shapeIds) return

      const result = await editor.getSvgString(shapeIds, {
        background: true,
        padding: 10,
        scale: 1,
      })

      if (!result) {
        throw new Error('Failed to generate SVG')
      }

      const blob = new Blob([result.svg], { type: 'image/svg+xml' })
      downloadFile(blob, `${documentName}-${Date.now()}.svg`)
      trackExportEvent('svg')
    } catch (error) {
      console.error('Failed to export SVG:', error)
      toast.error(t('toast.exportFailedTitle'), {
        description: t('toast.exportFailedSvg'),
      })
    }
  }

  async function exportAsPng() {
    try {
      const shapeIds = validateCanvasForExport()
      if (!shapeIds) return

      const result = await editor.toImage(shapeIds, {
        format: 'png',
        background: true,
        padding: 10,
        scale: 1,
        quality: 1,
      })

      if (!result) {
        throw new Error('Failed to generate PNG')
      }

      downloadFile(result.blob, `${documentName}-${Date.now()}.png`)
      trackExportEvent('png')
    } catch (error) {
      console.error('Failed to export PNG:', error)
      toast.error(t('toast.exportFailedTitle'), {
        description: t('toast.exportFailedPng'),
      })
    }
  }

  async function exportAsLink() {
    try {
      const snapshot = getSnapshot(editor.store)
      const documentData = JSON.stringify(snapshot.document)
      const compressedData = compressToEncodedURIComponent(documentData)

      const currentUrl = new URL(window.location.href)
      currentUrl.hash = `initialDocument=${compressedData}`

      await navigator.clipboard.writeText(currentUrl.toString())

      trackExportEvent('link')
      toast.success(t('toast.linkCopiedTitle'), {
        description: t('toast.linkCopiedDescription'),
      })
    } catch (error) {
      console.error('Failed to export as link:', error)
      toast.error(t('toast.exportFailedTitle'), {
        description: t('toast.exportFailedLink'),
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="/">
                <ArrowLeftIcon />
                {t('canvas.backToToolbox')}
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={checkUnsavedChangesAndOpen}>
              <FolderIcon />
              <span>{t('canvas.open')}</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={saveAs}>
              <FileDownIcon />
              <span>{t('canvas.saveTo')}</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DownloadIcon />
                <span>{t('canvas.export')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={exportAsSvg}>
                    <ImageDownIcon />
                    <span>SVG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsPng}>
                    <ImageDownIcon />
                    <span>PNG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsLink}>
                    <LinkIcon />
                    <span>{t('canvas.exportLink')}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={newDocument}>
              <FilePlusIcon />
              <span>{newDocumentLabel ?? t('canvas.newDocument')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon />
              <span>{t('canvas.settings')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={userPreferences.isSnapMode || false}
                  onCheckedChange={() => changeUserPreferences({ isSnapMode: !userPreferences.isSnapMode })}
                  closeOnSelect={false}
                >
                  {t('canvas.alwaysSnap')}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={gridModeActivated}
                  onCheckedChange={() => editor.updateInstanceState({ isGridMode: !gridModeActivated })}
                  closeOnSelect={false}
                >
                  {t('canvas.showGrid')}
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoonIcon />
                <span>{t('canvas.theme')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(newTheme) =>
                      changeUserPreferences({
                        colorScheme: newTheme as TLUserPreferences['colorScheme'],
                      })
                    }
                  >
                    <DropdownMenuRadioItem value="light">{t('canvas.themeLight')}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">{t('canvas.themeDark')}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">{t('canvas.themeSystem')}</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <LanguagesIcon />
                <span>{t('canvas.language')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'zh-CN')}>
                    <DropdownMenuRadioItem value="en">{t('canvas.languageEnglish')}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="zh-CN">{t('canvas.languageChinese')}</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={togglePresentationMode}>
              <MonitorSpeakerIcon />
              <span>{isReadonlyMode ? t('canvas.exitPresentation') : t('canvas.enterPresentation')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {exampleHref && (
              <DropdownMenuItem asChild>
                <a href={exampleHref} target="_blank" rel="noreferrer">
                  <LightbulbIcon />
                  {t('canvas.viewExample')}
                  <ExternalLinkIcon className="ml-auto" />
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <a href="https://github.com/poulainpi/ddd-toolbox" target="_blank" rel="noopener noreferrer">
                <GithubIcon />
                GitHub
                <ExternalLinkIcon className="ml-auto" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DiscardChangesAlertDialog disclosure={confirmDiscardChangesDisclosure} onConfirm={open} />
    </>
  )
}
