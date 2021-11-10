import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/UpdateConsumerRequest'
import { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/GetConsumerKYCResponse'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/CreateConsumerRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/SendVerificationCodeRequest'
import { VerifyEmail } from '~/plugins/weavr-multi/api/models/consumers/requests/VerifyEmail'
import { StartConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/StartConsumerKYCResponse'
import { StartConsumerKYCMobileResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/StartConsumerKYCMobileResponse'
import { ChargeFeeToConsumer } from '~/plugins/weavr-multi/api/models/consumers/requests/ChargeFeeToConsumer'

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

  chargeFee(data: ChargeFeeToConsumer): Promise<AxiosResponse> {
    return $axiosMulti.post('/consumers/fees/charge', data)
  }
}
