import type { ShellResolvedModule } from '../contracts/shell'

export interface ShellState {
  activeModuleId: string | null
  modules: ShellResolvedModule[]
}

export interface ShellStateStore {
  getState: () => ShellState
  setActiveModule: (moduleId: string | null) => void
  setModules: (modules: ShellResolvedModule[]) => void
  subscribe: (listener: (state: ShellState) => void) => () => void
}

export function createShellStateStore(initial?: Partial<ShellState>): ShellStateStore {
  let state: ShellState = {
    activeModuleId: initial?.activeModuleId ?? null,
    modules: initial?.modules ?? [],
  }

  const listeners = new Set<(state: ShellState) => void>()

  function notify() {
    listeners.forEach((listener) => listener(state))
  }

  return {
    getState: () => state,
    setActiveModule(moduleId) {
      state = { ...state, activeModuleId: moduleId }
      notify()
    },
    setModules(modules) {
      state = { ...state, modules }
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
