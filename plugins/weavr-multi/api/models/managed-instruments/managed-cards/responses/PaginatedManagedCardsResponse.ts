import { PaginatedResponse } from "~/plugins/weavr-multi/api/models/common/PaginatedResponse";
import { ManagedCardModel } from "~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel";

export interface PaginatedManagedCardsResponse extends PaginatedResponse {
    cards: ManagedCardModel[];
}
