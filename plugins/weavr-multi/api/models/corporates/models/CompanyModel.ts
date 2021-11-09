import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'

export interface CompanyModel {
  type: CompanyTypeEnum
  businessAddress?: Nullable<AddressModel>
  name: string
  registrationNumber: string
  registrationCountry: string
}
