import { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'
import { OutgoingWiretransferModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWiretransferModel'

export interface PaginatedOutgoingWireTransferResponse extends PaginatedResponse {
    transfer: OutgoingWiretransferModel[]
}
