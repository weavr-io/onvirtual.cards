import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import { StartCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/StartCorporateKYBResponse'
import { ChargeFeeToCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/ChargeFeeToCorporateRequest'
import { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'

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

    verifyEmail(data: VerifyEmailRequest): Promise<AxiosResponse> {
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
