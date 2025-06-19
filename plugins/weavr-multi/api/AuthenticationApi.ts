import { apiFetch, type ApiResponse } from '~/utils/api'
import type { LoginWithPassword } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPassword'
import type { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'

export class AuthenticationApi {
    loginWithPassword(request: LoginWithPassword): Promise<ApiResponse<LoginWithPasswordResponse>> {
        return apiFetch.post<LoginWithPasswordResponse>('/login_with_password', request)
    }

    logout(): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/logout', {})
    }
}
