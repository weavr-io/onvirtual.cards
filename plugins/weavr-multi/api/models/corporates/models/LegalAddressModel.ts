import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'

export interface LegalAddressModel extends AddressModel {
  postCode: string
}
