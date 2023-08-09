import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'

export interface CreateUserRequestModel {
    name: string
    surname: string
    email: string
    mobile?: MobileModel
    dateOfBirth?: DateModel
}
