'use client'

import { Provider } from 'jotai'

export const StateContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <Provider>{children}</Provider>
}
