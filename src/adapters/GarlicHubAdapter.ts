import type { CMSAdapter } from '../types'
import { smilToScreenliteJson } from '../utils/smilJsonToScreenliteJson'

const DEVICE_UUID_KEY = 'screenlite_device_uuid'

const getOrCreateDeviceUUID = (): string => {
    let uuid = localStorage.getItem(DEVICE_UUID_KEY)

    if (!uuid) {
        uuid = crypto.randomUUID()
        localStorage.setItem(DEVICE_UUID_KEY, uuid)
    }
    return uuid
}

export class GarlicHubAdapter implements CMSAdapter {
    private cmsUrl: string
    private pollingInterval: number
    private intervalId: NodeJS.Timeout | null = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private callback: ((state: any) => void) | null = null
    private etag: string | null = null
    private lastModified: string | null = null
    private deviceUUID: string
    private deviceName: string

    constructor(cmsUrl: string, pollingInterval: number = 10000, deviceName: string = 'Screenlite Web Player') {
        this.cmsUrl = new URL(cmsUrl).origin
        this.pollingInterval = pollingInterval
        this.deviceUUID = getOrCreateDeviceUUID()
        this.deviceName = deviceName
    }

    private async fetchData() {
        const headers: Record<string, string> = {}

        if (this.etag) {
            headers['If-None-Match'] = this.etag
        } else if (this.lastModified) {
            headers['If-Modified-Since'] = this.lastModified
        }

        headers['X-Signage-Agent'] = `GAPI/1.0 (UUID:${this.deviceUUID}; NAME:${this.deviceName}) screenlite-web/0.0.1 (MODEL:ScreenliteWeb)`

        const endpoint = `${this.cmsUrl}/smil-index`

        try {
            const headResponse = await fetch(endpoint, { method: 'HEAD', headers })

            if (headResponse.status === 304) {
                // No update needed
                return
            }

            if (headResponse.status !== 200) {
                console.warn(`GarlicHubAdapter: Unexpected HEAD response status: ${headResponse.status}`)
                return
            }

            const getResponse = await fetch(endpoint, { headers })

            if (getResponse.status === 200) {
                const smilXml = await getResponse.text()
                const data = smilToScreenliteJson(smilXml, this.cmsUrl)

                this.etag = getResponse.headers.get('ETag')
                this.lastModified = getResponse.headers.get('Last-Modified')

                try {
                    this.callback?.(data)
                } catch (callbackError) {
                    console.error('GarlicHubAdapter: Error in callback', callbackError)
                }
            } else {
                console.warn(`GarlicHubAdapter: Unexpected GET response status: ${getResponse.status}`)
            }
        } catch (error) {
            console.error('GarlicHubAdapter: Failed to fetch data', error)
        }
    }

    connect() {
        this.fetchData()
        this.intervalId = setInterval(() => this.fetchData(), this.pollingInterval)
    }

    disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate(callback: (state: any) => void) {
        this.callback = callback
    }
}
