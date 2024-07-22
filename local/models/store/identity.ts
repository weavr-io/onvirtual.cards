import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'

export interface Identity {
    identity: CorporateModel | ConsumerModel | null
    emailVerified: boolean
    mobileNumberVerified: boolean
}
