import type { AxiosResponse } from 'axios'
import type { LoginWithPassword } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPassword'
import type { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import { $axiosMulti } from '~/utils/api'

export class AuthenticationApi {
    loginWithPassword(
        request: LoginWithPassword,
    ): Promise<AxiosResponse<LoginWithPasswordResponse>> {
        return $axiosMulti.post<LoginWithPasswordResponse>('/login_with_password', request)
    }

    logout(): Promise<AxiosResponse> {
        return $axiosMulti.post('/logout', {})
    }
}
