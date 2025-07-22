import { apiFetch, type ApiResponse } from '~/utils/api'
import type { PaginatedOutgoingWireTransferResponse } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/responses/PaginatedOutgoingWireTransferResponse'
import type { OutgoingWireTransfersFilterRequest } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/requests/OutgoingWireTransfersFilterRequest'
import type { CreateOutGoingWireTransferRequest } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/requests/CreateOutGoingWireTransferRequest'
import type { OutgoingWiretransferModel } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWiretransferModel'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export class OutgoingWireTransferApi {
    index(
        filters?: OutgoingWireTransfersFilterRequest,
    ): Promise<ApiResponse<PaginatedOutgoingWireTransferResponse>> {
        return apiFetch.get<PaginatedOutgoingWireTransferResponse>('/outgoing_wire_transfers', {
            query: filters,
        })
    }

    store(
        request: CreateOutGoingWireTransferRequest,
    ): Promise<ApiResponse<OutgoingWiretransferModel>> {
        return apiFetch.post<OutgoingWiretransferModel>('/outgoing_wire_transfers', request)
    }

    show(id: IDModel): Promise<ApiResponse<OutgoingWiretransferModel>> {
        return apiFetch.get<OutgoingWiretransferModel>(`/outgoing_wire_transfers/${id}`)
    }
}
