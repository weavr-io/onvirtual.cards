import type { RootUserModel } from '~/plugins/weavr-multi/api/models/common/models/RootUserModel'
import { OccupationTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import type { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'

export interface ConsumersRootUserModel extends RootUserModel {
    occupation?: OccupationTypeEnum
    active: boolean
    emailVerified: boolean
    mobileNumberVerified: boolean
    address?: Address
    nationality?: string
}
