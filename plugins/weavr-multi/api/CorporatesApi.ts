import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/CreateCorporateRequest'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/corporates/models/CorporateModel'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/UpdateCorporateRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/SendVerificationCodeRequest'
import { StartCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/corporates/responses/StartCorporateKYBResponse'
import { ChargeFeeToCorporateRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/ChargeFeeToCorporateRequest'
import { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/corporates/responses/GetCorporateKYBResponse'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/VerifyEmailRequest'

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
    return $axiosMulti.post('/consumers/verification/email/send', data)
  }

  verifyEmail(data: VerifyEmailRequest): Promise<AxiosResponse> {
    return $axiosMulti.post('/corporates/verification/email/verify', data)
  }

  startCorporateKYB(): Promise<AxiosResponse<StartCorporateKYBResponse>> {
    return $axiosMulti.post<StartCorporateKYBResponse>('/corporates/kyb')
  }

  getCorporateKYB(): Promise<AxiosResponse<GetCorporateKYBResponse>> {
    return $axiosMulti.get<GetCorporateKYBResponse>('/corporates/kyb')
  }

  chargeFee(data: ChargeFeeToCorporateRequest): Promise<AxiosResponse> {
    return $axiosMulti.post('/corporates/fees/charge', data)
  }
}
