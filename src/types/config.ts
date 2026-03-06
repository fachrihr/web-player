export interface ConfigData {
    cmsAdapter: string
    cmsAdapterUrl: string
    timezone: string
    playbackTrackerEnabled: boolean
    deviceName: string
    showFps: boolean
    showElapsed: boolean
}

export interface ConfigStorageAdapter {
    get(): Promise<ConfigData>
    set(config: Partial<ConfigData>): Promise<void>
    clear(): Promise<void>
    isConfigured(): Promise<boolean>
}

export type ConfigOverlayProps = {
    isOpen: boolean
    onClose: () => void
} 