import { apiFetch } from '~/utils/api'
import type { AccessCode } from '~/plugins/weavr-multi/api/models/access-codes'

export class AccessCodesApi {
    verifyAccessCode(request: AccessCode) {
        return apiFetch.post(
            'https://europe-west3-weavr-production-env.cloudfunctions.net/onvirtual-reg-code',
            request,
        )
    }
}
