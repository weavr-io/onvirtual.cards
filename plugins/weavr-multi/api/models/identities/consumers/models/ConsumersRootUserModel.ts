import { RootUserModel } from '~/plugins/weavr-multi/api/models/common/models/RootUserModel'
import { OccupationTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/models/AddressModel'

export interface ConsumersRootUserModel extends RootUserModel {
    occupation?: OccupationTypeEnum
    active: boolean
    emailVerified: boolean
    mobileNumberVerified: boolean
    address?: AddressModel
    nationality?: string
}
