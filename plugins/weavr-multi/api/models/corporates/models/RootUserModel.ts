import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyPositionEnum'

export interface RootUserModel {
  name: string
  surname: string
  email: string
  mobile: MobileModel
  companyPosition: CompanyPositionEnum
}
