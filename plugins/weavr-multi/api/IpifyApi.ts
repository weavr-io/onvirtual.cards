import axios, { AxiosResponse } from 'axios'

export class IpifyApi {
    get(): Promise<AxiosResponse<{ ip: string }>> {
        return axios.get('https://api.ipify.org/?format=json')
    }
}
