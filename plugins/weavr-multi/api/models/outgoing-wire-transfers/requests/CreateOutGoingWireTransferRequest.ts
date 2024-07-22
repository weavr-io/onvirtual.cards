import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { SourceInstrumentModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel'
import { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import { OutgoingWireTransferBeneficiaryModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWireTransferBeneficiaryModel'

export interface CreateOutGoingWireTransferRequest {
    profileId: IDModel
    tag?: string
    sourceInstrument: SourceInstrumentModel
    transferAmount: CurrencyAmount
    description?: string
    destinationBeneficiary?: OutgoingWireTransferBeneficiaryModel
}
