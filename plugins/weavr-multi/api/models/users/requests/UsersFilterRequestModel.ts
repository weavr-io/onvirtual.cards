import { PagingModel } from '~/plugins/weavr-multi/api/models/common/models/PagingModel'

export interface UsersFilterRequestModel {
    paging?: PagingModel
    active?: boolean
    email?: string
}
