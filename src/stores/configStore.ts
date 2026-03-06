import { create } from 'zustand'
import type { ConfigData, ConfigStorageAdapter } from '../types/config'
import { LocalStorageConfigAdapter } from '../adapters/LocalStorageConfigAdapter'
import { DEFAULT_CONFIG } from '../config/defaults'

interface ConfigStore {
    config: ConfigData
    adapter: ConfigStorageAdapter
    isOverlayOpen: boolean
    isFirstRun: boolean
    configLoaded: boolean
    setAdapter: (adapter: ConfigStorageAdapter) => void
    loadConfig: () => Promise<void>
    updateConfig: (newConfig: Partial<ConfigData>) => Promise<void>
    clearConfig: () => Promise<void>
    setOverlayOpen: (isOpen: boolean) => void
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
    config: DEFAULT_CONFIG,
    adapter: new LocalStorageConfigAdapter(),
    isOverlayOpen: false,
    isFirstRun: false,
    configLoaded: false,

    setAdapter: (adapter) => set({ adapter }),

    loadConfig: async () => {
        const { adapter } = get()
        const [config, isConfigured] = await Promise.all([adapter.get(), adapter.isConfigured()])
        set({ config, isFirstRun: !isConfigured, configLoaded: true })
    },

    updateConfig: async (newConfig) => {
        const { adapter } = get()
        await adapter.set(newConfig)
        set((state) => ({ config: { ...state.config, ...newConfig }, isFirstRun: false }))
    },

    clearConfig: async () => {
        const { adapter } = get()
        await adapter.clear()
        set({ config: DEFAULT_CONFIG })
    },

    setOverlayOpen: (isOpen) => set({ isOverlayOpen: isOpen })
})) 