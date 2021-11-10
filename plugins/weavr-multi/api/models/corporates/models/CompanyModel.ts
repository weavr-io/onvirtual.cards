import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/corporates/models/LegalAddressModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'

export interface CompanyModel {
  name: string
  type: CompanyTypeEnum
  registrationNumber: string
  registeredAddress?: LegalAddressModel
  businessAddress?: Nullable<AddressModel>
  countryOfRegistration: string
  incorporatedOn?: DateModel
}
