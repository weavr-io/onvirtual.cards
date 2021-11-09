import { AddressModel } from "~/plugins/weavr-multi/api/models/common/AddressModel";

export interface UpdateManagedCardRequest {
    tag?: string;
    friendlyName?: string;
    cardholderMobileNumber?: string;
    billingAddress?: AddressModel;
}
