import { PagingModel } from "~/plugins/weavr-multi/api/models/common/PagingModel";
import { ManagedCardTypeEnum } from "~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardTypeEnum";
import { ManagedInstrumentStateEnum } from "~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum";

export interface ManagedCardsFilterRequest {
    paging?: PagingModel;
    profileId?: number;
    friendlyName?: string;
    state?: ManagedInstrumentStateEnum;
    currency?: string;
    type?: ManagedCardTypeEnum;
    externalHandle?: string;
    cardNumberFirstSix?: string;
    cardNumberLastFour?: string;
    createdFrom?: number;
    createdTo?: number;
    tag?: string;
}
