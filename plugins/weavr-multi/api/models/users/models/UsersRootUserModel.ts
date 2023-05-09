import { UserIdentityModel } from '~/plugins/weavr-multi/api/models/users/models/UserIdentityModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'

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
