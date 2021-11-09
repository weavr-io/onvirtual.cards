import { PasswordInfo } from "~/plugins/weavr-multi/api/models/passwords/models/PasswordInfo";

export interface CreatePasswordResponseModel {
    passwordInfo?: PasswordInfo;
    token?: string;
}
