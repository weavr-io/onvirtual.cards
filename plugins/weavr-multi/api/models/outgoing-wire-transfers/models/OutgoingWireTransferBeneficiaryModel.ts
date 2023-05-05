import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import { FasterPaymentsBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/FasterPaymentsBankDetailsModel'
import { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'

export interface OutgoingWireTransferBeneficiaryModel {
    name: string
    address?: AddressModel
    bankName?: string
    bankAddress?: AddressModel
    bankCountry?: string
    bankAccountDetails:
        | SepaBankDetailsModel
        | FasterPaymentsBankDetailsModel
        | SwiftBankDetailsModel
}
