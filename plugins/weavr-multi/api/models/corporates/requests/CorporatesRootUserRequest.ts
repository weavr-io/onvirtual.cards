import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyPositionEnum'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'

export interface CorporatesRootUserRequest {
  name: string
  surname: string
  email: string
  mobile: MobileModel
  companyPosition: CompanyPositionEnum
  dateOfBirth: DateModel
}
