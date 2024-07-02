import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'
import { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/LegalAddressModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'

export interface CompanyModel {
    name: string
    type: CompanyTypeEnum
    registrationNumber: string
    registeredAddress?: LegalAddressModel
    businessAddress?: Address
    countryOfRegistration: string
    incorporatedOn?: DateModel
}
