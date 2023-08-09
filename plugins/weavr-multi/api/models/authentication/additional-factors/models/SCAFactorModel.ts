import { SCAChallengeTypeEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAChallengeTypeEnum'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'

export interface SCAFactorModel {
    type?: SCAChallengeTypeEnum
    status?: SCAFactorStatusEnum
    channel?: SCAOtpChannelEnum
}
