import { InstrumentIdModel } from "~/plugins/weavr-multi/api/models/common/InstrumentIdModel";
import { CurrencyAmountModel } from "~/plugins/weavr-multi/api/models/common/CurrencyAmountModel";
import { TransactionStateTypeEnum } from "~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum";

export interface TransferModel {
    id: string;
    profileId: string;
    tag?: string;
    source: InstrumentIdModel;
    destination: InstrumentIdModel;
    destinationAmount: CurrencyAmountModel;
    state: TransactionStateTypeEnum;
    creationTimestamp: string | bigint;
}
