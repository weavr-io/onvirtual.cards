import { apiFetch, type ApiResponse } from '~/utils/api'
import type { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import type { StartCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/StartCorporateKYBResponse'
import type { ChargeFeeToCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/ChargeFeeToCorporateRequest'
import type { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import type { VerifyEmail } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmail'
import type { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'

export class CorporatesApi {
    store(data: CreateCorporateRequest): Promise<ApiResponse<CorporateModel>> {
        return apiFetch.post<CorporateModel>('/corporates', data)
    }

    show(): Promise<ApiResponse<CorporateModel>> {
        return apiFetch.get<CorporateModel>('/corporates')
    }

    update(data: UpdateCorporateRequest): Promise<ApiResponse<CorporateModel>> {
        return apiFetch.patch<CorporateModel>('/corporates', data)
    }

    sendVerificationCode(data: SendVerificationCodeRequest): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/corporates/verification/email/send', data)
    }

    verifyEmail(data: VerifyEmail): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/corporates/verification/email/verify', data)
    }

    startKYB(): Promise<ApiResponse<StartCorporateKYBResponse>> {
        return apiFetch.post<StartCorporateKYBResponse>('/corporates/kyb')
    }

    getCorporateKYB(): Promise<ApiResponse<GetCorporateKYBResponse>> {
        return apiFetch.get<GetCorporateKYBResponse>('/corporates/kyb')
    }

    chargeFee(data: ChargeFeeToCorporateRequest): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/corporates/fees/charge', data)
    }
}
