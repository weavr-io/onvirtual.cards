import { MobileModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/MobileModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'

export interface RootUserModel {
  id: IdentityIdModel
  name: string
  surname: string
  email: string
  mobile: MobileModel
  dateOfBirth?: DateModel
}
