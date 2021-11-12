import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'

export interface CompanyRequest {
  type: CompanyTypeEnum
  businessAddress: AddressModel
  name: string
  registrationNumber: string
  registrationCountry: string
}
