import { UserIdentityModel } from "~/plugins/weavr-multi/api/models/users/models/UserIdentityModel";
import { MobileModel } from "~/plugins/weavr-multi/api/models/corporates/models/MobileModel";

export interface RootUserModel {
    id: UserIdentityModel;
    name: string;
    surname: string;
    email: string;
    mobile: MobileModel;
    companyPosition: string;
    active: boolean;
    emailVerified: boolean;
    mobileNumberVerified: boolean;
}
