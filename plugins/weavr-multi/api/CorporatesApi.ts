import type { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import type { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import type { StartCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/StartCorporateKYBResponse'
import type { ChargeFeeToCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/ChargeFeeToCorporateRequest'
import type { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import type { VerifyEmail } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmail'
import type { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'

export class CorporatesApi {
    store(data: CreateCorporateRequest): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.post<CorporateModel>('/corporates', data)
    }

    show(): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.get<CorporateModel>('/corporates')
    }

    update(data: UpdateCorporateRequest): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.patch<CorporateModel>('/corporates', data)
    }

    sendVerificationCode(data: SendVerificationCodeRequest): Promise<AxiosResponse> {
        return $axiosMulti.post('/corporates/verification/email/send', data)
    }

    verifyEmail(data: VerifyEmail): Promise<AxiosResponse> {
        return $axiosMulti.post('/corporates/verification/email/verify', data)
    }

    startKYB(): Promise<AxiosResponse<StartCorporateKYBResponse>> {
        return $axiosMulti.post<StartCorporateKYBResponse>('/corporates/kyb')
    }

    getCorporateKYB(): Promise<AxiosResponse<GetCorporateKYBResponse>> {
        return $axiosMulti.get<GetCorporateKYBResponse>('/corporates/kyb')
    }

    chargeFee(data: ChargeFeeToCorporateRequest): Promise<AxiosResponse> {
        return $axiosMulti.post('/corporates/fees/charge', data)
    }
}
