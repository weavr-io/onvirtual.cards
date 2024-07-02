import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'

export interface RootUserModel {
    id: IdentityIdModel
    name: string
    surname: string
    email: string
    mobile: MobileModel
    dateOfBirth?: DateModel
}
