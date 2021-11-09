import { PagingModel } from "~/plugins/weavr-multi/api/models/common/PagingModel";
import { SourceInstrumentModel } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/models/SourceInstrumentModel";
import { OutgoingWireTransferStateTypeEnum } from "~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/OutgoingWireTransferStateTypeEnum";

export interface OutgoingWireTransfersFilterRequest {
    paging?: PagingModel;
    profileId: number;
    instrument?: SourceInstrumentModel;
    state?: OutgoingWireTransferStateTypeEnum;
    createdFrom?: number;
    createdTo?: number;
    tag?: string;
}
