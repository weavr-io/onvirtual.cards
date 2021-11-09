import { CurrencyEnum } from "~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum";
import { DefaultCurrencySelectValueConst } from "~/models/local/constants/DefaultSelectValueConst";

export const CurrencySelectConst: { value: CurrencyEnum; text: string }[] = [
    { ...DefaultCurrencySelectValueConst },
    { value: CurrencyEnum.EUR, text: "EUR" },
    { value: CurrencyEnum.GBP, text: "GBP" },
    { value: CurrencyEnum.USD, text: "USD" },
];
