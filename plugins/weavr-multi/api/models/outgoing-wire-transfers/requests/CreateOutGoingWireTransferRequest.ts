import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { SourceInstrumentModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel'
import type { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import type { OutgoingWireTransferBeneficiaryModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWireTransferBeneficiaryModel'

export interface CreateOutGoingWireTransferRequest {
    profileId: IDModel
    tag?: string
    sourceInstrument: SourceInstrumentModel
    transferAmount: CurrencyAmount
    description?: string
    destinationBeneficiary?: OutgoingWireTransferBeneficiaryModel
}
