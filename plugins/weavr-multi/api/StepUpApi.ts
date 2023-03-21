import { AxiosResponse } from '~/node_modules/axios'
import { $axiosMulti } from '~/utils/api'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'

export class StepUpApi {
  enroll(channel: SCAOtpChannelEnum): Promise<AxiosResponse> {
    return $axiosMulti.post(`/stepup/challenges/otp/${channel}`)
  }

  verify(request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest }): Promise<AxiosResponse> {
    return $axiosMulti.post(`/stepup/challenges/otp/${request.channel}/verify`, request.body)
  }
}
