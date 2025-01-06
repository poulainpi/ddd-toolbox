import { useState } from 'react'

export interface UseDisclosureReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setIsOpen: (isOpen: boolean) => void
}

export function useDisclosure(): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen(!isOpen)
  return {
    isOpen,
    open: onOpen,
    close: onClose,
    toggle: onToggle,
    setIsOpen,
  }
}
