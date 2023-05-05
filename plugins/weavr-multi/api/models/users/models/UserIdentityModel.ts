import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

export interface UserIdentityModel {
    type: 'corporate' | 'consumer'
    id: IDModel
}
