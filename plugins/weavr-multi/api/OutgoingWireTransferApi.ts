import { AxiosResponse } from "axios";
import { $axiosMulti } from "~/utils/api";
import { PaginatedOutgoingWireTransferResponse } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/responses/PaginatedOutgoingWireTransferResponse";
import { OutgoingWireTransfersFilterRequest } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/requests/OutgoingWireTransfersFilterRequest";
import { CreateOutGoingWireTransferRequest } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/requests/CreateOutGoingWireTransferRequest";
import { OutgoingWiretransferModel } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/OutgoingWiretransferModel";
import { IDModel } from "~/plugins/weavr-multi/api/models/common/IDModel";

export class OutgoingWireTransferApi {
    index(filters?: OutgoingWireTransfersFilterRequest): Promise<AxiosResponse<PaginatedOutgoingWireTransferResponse>> {
        return $axiosMulti.get<PaginatedOutgoingWireTransferResponse>("/outgoing_wire_transfers", { data: filters });
    }

    store(request: CreateOutGoingWireTransferRequest): Promise<AxiosResponse<OutgoingWiretransferModel>> {
        return $axiosMulti.post<OutgoingWiretransferModel>("/outgoing_wire_transfers", request);
    }

    show(id: IDModel): Promise<AxiosResponse<OutgoingWiretransferModel>> {
        return $axiosMulti.get<OutgoingWiretransferModel>("/outgoing_wire_transfers/" + id);
    }
}
