import { AxiosResponse } from '~/node_modules/axios'
import { $axiosMulti } from '~/utils/api'
import { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'

export class AdditionalFactorsApi {
    index(): Promise<AxiosResponse<GetAuthenticationFactorsResponse>> {
        return $axiosMulti.get<GetAuthenticationFactorsResponse>('/authentication_factors')
    }

    enroll(channel: SCAOtpChannelEnum): Promise<AxiosResponse> {
        return $axiosMulti.post(`/authentication_factors/otp/${channel}`)
    }

    verify(request: {
        channel: SCAOtpChannelEnum
        body: AuthVerifyEnrolRequest
    }): Promise<AxiosResponse> {
        return $axiosMulti.post(
            `/authentication_factors/otp/${request.channel}/verify`,
            request.body
        )
    }
}
