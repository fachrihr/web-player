export const DEFAULT_CONFIG = {
    cmsAdapter: 'NetworkFile',
    cmsAdapterUrl: '',
    timezone: 'Asia/Jakarta',
    playbackTrackerEnabled: false,
    deviceName: 'Screenlite Web Player',
    showFps: false,
    showElapsed: false
} as const

export const getDefaultValue = <K extends keyof typeof DEFAULT_CONFIG>(key: K) => DEFAULT_CONFIG[key] 