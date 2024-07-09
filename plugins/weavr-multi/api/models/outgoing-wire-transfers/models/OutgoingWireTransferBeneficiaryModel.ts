import type { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'
import type { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import type { FasterPaymentsBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/FasterPaymentsBankDetailsModel'
import type { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'

export interface OutgoingWireTransferBeneficiaryModel {
    name: string
    address?: Address
    bankName?: string
    bankAddress?: Address
    bankCountry?: string
    bankAccountDetails:
        | SepaBankDetailsModel
        | FasterPaymentsBankDetailsModel
        | SwiftBankDetailsModel
}
