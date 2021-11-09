import { BankAccountTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/enums/BankAccountTypeEnum'
import { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import { FasterPaymentsBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/FasterPaymentsBankDetailsModel'
import { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'

export interface BankAccountDetailsModel {
  beneficiaryNameAndSurname: string
  beneficiaryBank: string
  beneficiaryBankAddress: string
  type: BankAccountTypeEnum
  paymentReference?: string
  details: SepaBankDetailsModel | FasterPaymentsBankDetailsModel | SwiftBankDetailsModel
}
