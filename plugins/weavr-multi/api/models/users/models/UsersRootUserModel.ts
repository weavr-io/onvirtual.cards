import { UserIdentityModel } from '~/plugins/weavr-multi/api/models/users/models/UserIdentityModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyPositionEnum'

export interface UsersRootUserModel {
  id: UserIdentityModel
  name: string
  surname: string
  email: string
  mobile: MobileModel
  companyPosition: CompanyPositionEnum
  active: boolean
  emailVerified: boolean
  mobileNumberVerified: boolean
}
