import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import { RootUserModel } from '~/plugins/weavr-multi/api/models/common/RootUserModel'

export interface CorporatesRootUserModel extends RootUserModel {
    companyPosition: CompanyPositionEnum
    active: boolean
    emailVerified: boolean
    mobileNumberVerified: boolean
}
