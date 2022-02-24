import { AxiosResponse } from 'axios'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import { $axiosMulti } from '~/utils/api'

export class AuthenticationApi {
  loginWithPassword(request: LoginWithPasswordRequest): Promise<AxiosResponse<LoginWithPasswordResponse>> {
    return $axiosMulti.post<LoginWithPasswordResponse>('/login_with_password', request)
  }

  logout(): Promise<AxiosResponse> {
    return $axiosMulti.post('/logout', {})
  }
}
