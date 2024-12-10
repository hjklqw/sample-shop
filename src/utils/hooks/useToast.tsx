import { useCallback, useRef, useState } from 'react'

import { Toast, ToastProps } from '@/components/toast'

export function useToast(
  { message: defaultMessage, ...props }: ToastProps,
  time = 1000
) {
  const [isShowing, setShowing] = useState<boolean>(false)
  const [message, setMessage] = useState<React.ReactNode>(defaultMessage)

  const timer = useRef<NodeJS.Timeout>()

  const showToast = useCallback(
    (messageOverride?: React.ReactNode) => {
      setShowing(true)
      messageOverride ? setMessage(messageOverride) : setMessage(defaultMessage)
      timer.current = setTimeout(() => setShowing(false), time)
    },
    [time, defaultMessage]
  )

  const toast = isShowing ? <Toast {...props} message={message} /> : null

  return {
    toast,
    showToast,
  }
}
