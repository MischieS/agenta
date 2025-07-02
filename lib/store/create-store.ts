import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

/**
 * Helper to create a store with persistence and immer middleware
 * This provides a more robust state management approach than basic Context API
 */
export function createStore<T extends object>(
  initialState: T,
  name: string,
  storeFn: StateCreator<T, [['zustand/immer', never]], []>,
  persistOptions?: Partial<PersistOptions<T>>
) {
  return create<T>()(
    persist(
      immer(storeFn),
      {
        name: `eduturkia-${name}`,
        ...persistOptions,
      }
    )
  )
}
