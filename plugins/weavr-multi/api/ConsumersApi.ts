import { apiFetch, type ApiResponse } from '~/utils/api'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import type { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/GetConsumerKYCResponse'
import type { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import type { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'
import type { VerifyEmail } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmail'
import type { StartConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/StartConsumerKYCResponse'
import type { StartConsumerKYCMobileResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/StartConsumerKYCMobileResponse'
import type { ChargeFeeToConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/ChargeFeeToConsumerRequest'

export class ConsumersApi {
    store(data: CreateConsumerRequest): Promise<ApiResponse<ConsumerModel>> {
        return apiFetch.post<ConsumerModel>('/consumers', data)
    }

    show(): Promise<ApiResponse<ConsumerModel>> {
        return apiFetch.get<ConsumerModel>('/consumers')
    }

    update(data: UpdateConsumerRequest): Promise<ApiResponse<ConsumerModel>> {
        return apiFetch.patch<ConsumerModel>('/consumers', data)
    }

    sendVerificationCode(data: SendVerificationCodeRequest): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/consumers/verification/email/send', data)
    }

    verifyEmail(data: VerifyEmail): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/consumers/verification/email/verify', data)
    }

    startKYC(): Promise<ApiResponse<StartConsumerKYCResponse>> {
        return apiFetch.post<StartConsumerKYCResponse>('/consumers/kyc')
    }

    showKYC(): Promise<ApiResponse<GetConsumerKYCResponse>> {
        return apiFetch.get<GetConsumerKYCResponse>('/consumers/kyc', {})
    }

    startKYCOnMobile(): Promise<ApiResponse<StartConsumerKYCMobileResponse>> {
        return apiFetch.post<StartConsumerKYCMobileResponse>('/consumers/kyc_mobile_sumsub')
    }

    chargeFee(data: ChargeFeeToConsumerRequest): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/consumers/fees/charge', data)
    }
}
