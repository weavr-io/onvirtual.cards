import type { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import type { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'

export interface Auth {
    auth: LoginWithPasswordResponse | null
    authFactors: GetAuthenticationFactorsResponse | null
    isLoading: boolean
}
