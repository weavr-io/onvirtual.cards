import { apiFetch, type ApiResponse } from '~/utils/api'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import type { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'
import type { AuthVerifyEnrol } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'

export class AdditionalFactorsApi {
    index(): Promise<ApiResponse<GetAuthenticationFactorsResponse>> {
        return apiFetch.get<GetAuthenticationFactorsResponse>('/authentication_factors')
    }

    enroll(channel: SCAOtpChannelEnum): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/authentication_factors/otp/${channel}`)
    }

    verify(request: {
        channel: SCAOtpChannelEnum
        body: AuthVerifyEnrol
    }): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/authentication_factors/otp/${request.channel}/verify`, request.body)
    }
}
