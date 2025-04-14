import type { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
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
    store(data: CreateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
        return $axiosMulti.post<ConsumerModel>('/consumers', data)
    }

    show(): Promise<AxiosResponse<ConsumerModel>> {
        return $axiosMulti.get<ConsumerModel>('/consumers')
    }

    update(data: UpdateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
        return $axiosMulti.patch<ConsumerModel>('/consumers', data)
    }

    sendVerificationCode(data: SendVerificationCodeRequest): Promise<AxiosResponse> {
        return $axiosMulti.post('/consumers/verification/email/send', data)
    }

    verifyEmail(data: VerifyEmail): Promise<AxiosResponse> {
        return $axiosMulti.post('/consumers/verification/email/verify', data)
    }

    startKYC(): Promise<AxiosResponse<StartConsumerKYCResponse>> {
        return $axiosMulti.post<StartConsumerKYCResponse>('/consumers/kyc')
    }

    showKYC(): Promise<AxiosResponse<GetConsumerKYCResponse>> {
        return $axiosMulti.get<GetConsumerKYCResponse>('/consumers/kyc', {})
    }

    startKYCOnMobile(): Promise<AxiosResponse<StartConsumerKYCMobileResponse>> {
        return $axiosMulti.post<StartConsumerKYCMobileResponse>('/consumers/kyc_mobile_sumsub')
    }

    chargeFee(data: ChargeFeeToConsumerRequest): Promise<AxiosResponse> {
        return $axiosMulti.post('/consumers/fees/charge', data)
    }
}
