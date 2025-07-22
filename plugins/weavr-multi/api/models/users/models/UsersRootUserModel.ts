import type { UserIdentityModel } from '~/plugins/weavr-multi/api/models/users/models/UserIdentityModel'
import type { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import type { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'

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
    dateOfBirth: DateModel
}
