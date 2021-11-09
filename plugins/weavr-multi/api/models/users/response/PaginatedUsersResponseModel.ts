import { UserModel } from "~/plugins/weavr-multi/api/models/users/models/UserModel";
import { PaginatedResponse } from "~/plugins/weavr-multi/api/models/common/PaginatedResponse";

export interface PaginatedUsersResponseModel extends PaginatedResponse {
    users: UserModel[];
}
