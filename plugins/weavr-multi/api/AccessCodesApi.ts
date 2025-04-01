import axios from 'axios'
import type { AccessCode } from '~/plugins/weavr-multi/api/models/access-codes'

export class AccessCodesApi {
    verifyAccessCode(request: AccessCode) {
        return axios.post(
            'https://europe-west3-weavr-production-env.cloudfunctions.net/onvirtual-reg-code',
            request,
        )
    }
}
