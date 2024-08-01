import type { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import type { FasterPaymentsBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/FasterPaymentsBankDetailsModel'
import type { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'

export interface BankAccountDetailsModel {
    beneficiaryNameAndSurname: string
    beneficiaryBank: string
    beneficiaryBankAddress: string
    paymentReference?: string
    details: SepaBankDetailsModel | FasterPaymentsBankDetailsModel | SwiftBankDetailsModel
}
