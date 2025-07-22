import { apiFetch, type ApiResponse } from '~/utils/api'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import type { AuthVerifyEnrol } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'

export class StepUpApi {
    enroll(channel: SCAOtpChannelEnum): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/stepup/challenges/otp/${channel}`)
    }

    verify(request: {
        channel: SCAOtpChannelEnum
        body: AuthVerifyEnrol
    }): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/stepup/challenges/otp/${request.channel}/verify`, request.body)
    }
}
