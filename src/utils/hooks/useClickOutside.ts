import { useCallback, useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(
  isActive: boolean,
  onClickOutside: (e: MouseEvent | KeyboardEvent) => void
) {
  const ref = useRef<T>(null)

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickOutside(e)
      }
    },
    [onClickOutside]
  )

  const onDocumentClicked = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside(e)
      }
    },
    [onClickOutside]
  )

  const addListeners = useCallback(() => {
    document.addEventListener('keydown', onKeydown, true)
    document.addEventListener('click', onDocumentClicked, true)
  }, [onKeydown, onDocumentClicked])

  const removeListeners = useCallback(() => {
    document.removeEventListener('keydown', onKeydown, true)
    document.removeEventListener('click', onDocumentClicked, true)
  }, [onKeydown, onDocumentClicked])

  useEffect(() => {
    if (isActive) {
      addListeners()
    } else {
      removeListeners()
    }
  }, [addListeners, isActive, removeListeners])

  useEffect(() => {
    return () => {
      removeListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
