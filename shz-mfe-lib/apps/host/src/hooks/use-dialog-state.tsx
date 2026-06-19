import { useState } from 'react'

type OpenState = boolean | null | string

export function useDialogState(defaultOpen: OpenState = null) {
  return useState<OpenState>(defaultOpen)
}

export default useDialogState
