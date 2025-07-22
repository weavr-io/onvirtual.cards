import type { IDModel } from './models/common/models/IDModel'
import { apiFetch, type ApiResponse } from '~/utils/api'
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
    }): Promise<ApiResponse<CreatePasswordResponseModel>> {
        return apiFetch.post<CreatePasswordResponseModel>(
            `/passwords/${params.userId}/create`,
            params.data,
        )
    }

    update(request: UpdatePasswordRequestModel): Promise<ApiResponse<CreatePasswordResponseModel>> {
        return apiFetch.post<CreatePasswordResponseModel>('/passwords/update', request)
    }

    validate(request: ValidatePasswordRequestModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/passwords/validate', request)
    }

    initiate(request: InitiateLostPasswordRequestModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/passwords/lost_password/start', request)
    }

    resume(request: ResumeLostPassword): Promise<ApiResponse<ResumeLostPasswordResponseModel>> {
        return apiFetch.post<ResumeLostPasswordResponseModel>(
            '/passwords/lost_password/resume',
            request,
        )
    }
}
