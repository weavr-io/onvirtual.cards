export class IpifyApi {
    async get(): Promise<{ data: any; status: number }> {
        try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return { data, status: response.status }
        } catch (error) {
            console.error('Failed to fetch IP address:', error)
            throw error
        }
    }
}
