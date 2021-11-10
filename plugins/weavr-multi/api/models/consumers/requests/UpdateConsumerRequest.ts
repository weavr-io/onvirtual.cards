import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { OccupationTypeEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/OccupationTypeEnum'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface UpdateConsumerRequest {
  tag?: string
  name?: string
  surname?: string
  email?: string
  mobile?: MobileModel
  dateOfBirth?: DateModel
  address?: AddressModel
  feeGroup?: string
  baseCurrency?: string
  occupation?: OccupationTypeEnum
  sourceOfFunds?: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
}
