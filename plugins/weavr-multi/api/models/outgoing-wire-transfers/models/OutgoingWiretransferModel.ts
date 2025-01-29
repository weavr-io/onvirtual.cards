import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { SourceInstrumentModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel'
import type { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import type { OutgoingWireTransferBeneficiaryModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWireTransferBeneficiaryModel'
import { OutgoingWireTransferTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/OutgoingWireTransferTypeEnum'
import { OutgoingWireTransferStateTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/OutgoingWireTransferStateTypeEnum'

export interface OutgoingWiretransferModel {
    id: IDModel
    profileId: IDModel
    tag?: string
    sourceInstrument: SourceInstrumentModel
    transferAmount: CurrencyAmount
    description?: string
    type: OutgoingWireTransferTypeEnum
    destination: OutgoingWireTransferBeneficiaryModel
    state: OutgoingWireTransferStateTypeEnum
    creationTimestamp: IDModel
}
