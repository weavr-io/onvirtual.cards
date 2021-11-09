import { InstrumentIdModel } from "~/plugins/weavr-multi/api/models/common/InstrumentIdModel";
import { CurrencyAmountModel } from "~/plugins/weavr-multi/api/models/common/CurrencyAmountModel";

export interface CreateTransferRequest {
    profileId: string;
    tag?: string;
    source: InstrumentIdModel;
    destination: InstrumentIdModel;
    destinationAmount: CurrencyAmountModel;
}
