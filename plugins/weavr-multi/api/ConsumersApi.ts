import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/UpdateConsumerRequest'
import { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/GetConsumerKYCResponse'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/CreateConsumerRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/SendVerificationCodeRequest'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/VerifyEmailRequest'
import { StartConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/StartConsumerKYCResponse'
import { StartConsumerKYCMobileResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/StartConsumerKYCMobileResponse'
import { ChargeFeeToConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/ChargeFeeToConsumerRequest'

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

  verifyEmail(data: VerifyEmailRequest): Promise<AxiosResponse> {
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
