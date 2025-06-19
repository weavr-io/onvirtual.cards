import { apiFetch, type ApiResponse } from '~/utils/api'

export class IpifyApi {
    get(): Promise<ApiResponse<{ ip: string }>> {
        return apiFetch.get('https://api.ipify.org/?format=json')
    }
}
