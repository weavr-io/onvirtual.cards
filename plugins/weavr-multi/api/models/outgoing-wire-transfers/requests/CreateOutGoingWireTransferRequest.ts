import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { SourceInstrumentModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { OutgoingWireTransferBeneficiaryModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWireTransferBeneficiaryModel'

export interface CreateOutGoingWireTransferRequest {
  profileId: IDModel
  tag?: string
  sourceInstrument: SourceInstrumentModel
  transferAmount: CurrencyAmountModel
  description?: string
  destinationBeneficiary?: OutgoingWireTransferBeneficiaryModel
}
