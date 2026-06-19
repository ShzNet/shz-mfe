import { createContext, useContext, useState } from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
type Variant = 'inset' | 'sidebar' | 'floating'

const COLLAPSIBLE_COOKIE = 'layout_collapsible'
const VARIANT_COOKIE = 'layout_variant'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const DEFAULT_VARIANT: Variant = 'inset'
const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'

type LayoutContextType = {
  collapsible: Collapsible
  setCollapsible: (v: Collapsible) => void
  variant: Variant
  setVariant: (v: Variant) => void
  resetLayout: () => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = getCookie(COLLAPSIBLE_COOKIE)
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE
  })

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = getCookie(VARIANT_COOKIE)
    return (saved as Variant) || DEFAULT_VARIANT
  })

  const setCollapsible = (v: Collapsible) => {
    _setCollapsible(v)
    setCookie(COLLAPSIBLE_COOKIE, v, COOKIE_MAX_AGE)
  }

  const setVariant = (v: Variant) => {
    _setVariant(v)
    setCookie(VARIANT_COOKIE, v, COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  return (
    <LayoutContext value={{ collapsible, setCollapsible, variant, setVariant, resetLayout }}>
      {children}
    </LayoutContext>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('useLayout must be used within a LayoutProvider')
  return context
}
