import type { CMSAdapter } from '../types'
import { NetworkFileAdapter } from '../adapters/NetworkFileAdapter'
import { GarlicHubAdapter } from '../adapters/GarlicHubAdapter'
import { ScreenliteAdapter } from '../adapters/ScreenliteAdapter'

class NullAdapter implements CMSAdapter {
    connect() {}
    disconnect() {}
    onUpdate() {}
}

export const getCMSAdapter = (adapter: string, url: string, deviceName?: string) => {
    if (!url) return new NullAdapter()

    if (adapter === 'NetworkFile') {
        return new NetworkFileAdapter(url)
    } else if (adapter === 'GarlicHub') {
        return new GarlicHubAdapter(url, undefined, deviceName)
    } else if (adapter === 'Screenlite') {
        return new ScreenliteAdapter(url)	
    } else {
        throw new Error(`Unknown CMS adapter: ${adapter}`)
    }
}
