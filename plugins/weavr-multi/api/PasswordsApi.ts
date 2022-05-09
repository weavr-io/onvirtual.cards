import { AxiosResponse } from 'axios'
import { IDModel } from './models/common/IDModel'
import { $axiosMulti } from '~/utils/api'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { CreatePasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/CreatePasswordResponseModel'
import { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import { InitiateLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/InitiateLostPasswordRequestModel'
import { ResumeLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPasswordRequestModel'
import { ResumeLostPasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/ResumeLostPasswordResponseModel'
import { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'

export class PasswordsApi {
  store(params: {
    userId: IDModel
    data: CreatePasswordRequestModel
  }): Promise<AxiosResponse<CreatePasswordResponseModel>> {
    return $axiosMulti.post<CreatePasswordResponseModel>('/passwords/' + params.userId + '/create', params.data)
  }

  update(request: UpdatePasswordRequestModel): Promise<AxiosResponse<CreatePasswordResponseModel>> {
    return $axiosMulti.post<CreatePasswordResponseModel>('/passwords/update', request)
  }

  validate(request: ValidatePasswordRequestModel): Promise<AxiosResponse> {
    return $axiosMulti.post('/passwords/validate', request)
  }

  initiate(request: InitiateLostPasswordRequestModel): Promise<AxiosResponse> {
    return $axiosMulti.post('/passwords/lost_password/start', request)
  }

  resume(request: ResumeLostPasswordRequestModel): Promise<AxiosResponse<ResumeLostPasswordResponseModel>> {
    return $axiosMulti.post<ResumeLostPasswordResponseModel>('/passwords/lost_password/resume', request)
  }
}
