import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'
import type { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'
import type { LegalAddressModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/LegalAddressModel'
import type { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'

export interface CompanyModel {
    name: string
    type: CompanyTypeEnum
    registrationNumber: string
    registeredAddress?: LegalAddressModel
    businessAddress?: Address
    countryOfRegistration: string
    incorporatedOn?: DateModel
}
