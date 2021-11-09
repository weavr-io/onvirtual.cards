import { AxiosResponse } from "axios";
import { $axiosMulti } from "~/utils/api";
import { CreateCorporateRequest } from "~/plugins/weavr-multi/api/models/corporates/requests/CreateCorporateRequest";
import { CorporateModel } from "~/plugins/weavr-multi/api/models/corporates/models/CorporateModel";
import { UpdateCorporateRequest } from "~/plugins/weavr-multi/api/models/corporates/requests/UpdateCorporateRequest";

export class CorporatesApi {
    store(data: CreateCorporateRequest): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.post<CorporateModel>("/corporates", data);
    }

    show(): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.get<CorporateModel>("/corporates");
    }

    update(data: UpdateCorporateRequest): Promise<AxiosResponse<CorporateModel>> {
        return $axiosMulti.patch<CorporateModel>("/corporates", data);
    }
}
