import type { AxiosResponse } from 'axios'
import type { IDModel } from './models/common/models/IDModel'
import { $axiosMulti } from '~/utils/api'
import type { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import type { CreatePasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/CreatePasswordResponseModel'
import type { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import type { InitiateLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/InitiateLostPasswordRequestModel'
import type { ResumeLostPasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/ResumeLostPasswordResponseModel'
import type { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'
import type { ResumeLostPassword } from '~/plugins/weavr-multi/api/models/authentication/passwords'

export class PasswordsApi {
    store(params: {
        userId: IDModel
        data: CreatePasswordRequestModel
    }): Promise<AxiosResponse<CreatePasswordResponseModel>> {
        return $axiosMulti.post<CreatePasswordResponseModel>(
            '/passwords/' + params.userId + '/create',
            params.data,
        )
    }

    update(
        request: UpdatePasswordRequestModel,
    ): Promise<AxiosResponse<CreatePasswordResponseModel>> {
        return $axiosMulti.post<CreatePasswordResponseModel>('/passwords/update', request)
    }

    validate(request: ValidatePasswordRequestModel): Promise<AxiosResponse> {
        return $axiosMulti.post('/passwords/validate', request)
    }

    initiate(request: InitiateLostPasswordRequestModel): Promise<AxiosResponse> {
        return $axiosMulti.post('/passwords/lost_password/start', request)
    }

    resume(request: ResumeLostPassword): Promise<AxiosResponse<ResumeLostPasswordResponseModel>> {
        return $axiosMulti.post<ResumeLostPasswordResponseModel>(
            '/passwords/lost_password/resume',
            request,
        )
    }
}
