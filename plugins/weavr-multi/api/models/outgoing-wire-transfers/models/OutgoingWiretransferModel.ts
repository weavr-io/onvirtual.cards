import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { SourceInstrumentModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { OutgoingWireTransferBeneficiaryModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWireTransferBeneficiaryModel'
import { OutgoingWireTransferTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/OutgoingWireTransferTypeEnum'
import { OutgoingWireTransferStateTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/OutgoingWireTransferStateTypeEnum'

export interface OutgoingWiretransferModel {
    id: IDModel
    profileId: IDModel
    tag?: string
    sourceInstrument: SourceInstrumentModel
    transferAmount: CurrencyAmountModel
    description?: string
    type: OutgoingWireTransferTypeEnum
    destination: OutgoingWireTransferBeneficiaryModel
    state: OutgoingWireTransferStateTypeEnum
    creationTimestamp: IDModel
}
