import { SensitivePasswordModel } from "~/plugins/weavr-multi/api/models/authentication/models/SensitivePasswordModel";

export interface InviteConsumeRequestModel {
    inviteCode: string;
    password?: SensitivePasswordModel;
}
