import { useState } from 'react'

/** Currently not used, but leaving here just in case */
export function useModal(
  render: (isOpen: boolean, close: () => void) => JSX.Element
) {
  const [isOpen, setOpen] = useState<boolean>(false)

  return {
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    modal: render(isOpen, () => setOpen(false)),
  }
}
