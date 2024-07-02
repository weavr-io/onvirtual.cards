import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export interface UserIdentityModel {
    type: 'corporate' | 'consumer'
    id: IDModel
}
