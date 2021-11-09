import { PagingModel } from "~/plugins/weavr-multi/api/models/common/PagingModel";
import { ManagedInstrumentStateEnum } from "~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum";

export interface ManagedAccountsFilterRequest {
    paging?: PagingModel;
    profileId?: number;
    friendlyName?: string;
    state?: ManagedInstrumentStateEnum;
    currency?: string;
    createdFrom?: number;
    createdTo?: number;
    tag?: string;
}
