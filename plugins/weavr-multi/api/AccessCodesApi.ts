import axios from 'axios'
import { AccessCodeModel } from '~/plugins/weavr-multi/api/models/access-codes/models/AccessCodeModel'

export class AccessCodesApi {
    verifyAccessCode(request: AccessCodeModel) {
        return axios.post(
            'https://europe-west3-weavr-production-env.cloudfunctions.net/onvirtual-reg-code',
            request,
        )
    }
}
