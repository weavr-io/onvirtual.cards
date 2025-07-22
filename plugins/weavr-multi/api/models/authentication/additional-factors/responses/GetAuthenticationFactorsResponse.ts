import type { SCAFactorModel } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/models/SCAFactorModel'

export interface GetAuthenticationFactorsResponse {
    factors?: SCAFactorModel[]
}
