import { ReplacementTypeEnum } from "~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ReplacementTypeEnum";

export interface PhysicalCardDetailsModel {
    productReference?: string;
    carrierType?: string;
    pendingActivation: boolean;
    pinBlocked?: boolean;
    replacement?: {
        replacementType?: ReplacementTypeEnum;
        replacementActivation?: boolean;
    };
}
