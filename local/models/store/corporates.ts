import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'

export interface Corporates {
    isLoading: boolean
    isLoadingRegistration: boolean
    corporate: CorporateModel | null
    kyb: GetCorporateKYBResponse | null
}
