import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'
import { OccupationTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'

export interface ConsumersRootUserRequest {
  name: string
  surname: string
  email: string
  mobile: MobileModel
  dateOfBirth: DateModel
  occupation: OccupationTypeEnum
  address?: AddressModel
}
