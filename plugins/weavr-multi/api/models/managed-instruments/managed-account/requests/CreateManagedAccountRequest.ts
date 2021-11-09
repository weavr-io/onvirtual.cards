import { IDModel } from '../../../common/IDModel'
import { UpdateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/UpdateManagedAccountRequest'

export interface CreateManagedAccountRequest extends UpdateManagedAccountRequest {
  profileId: IDModel
  friendlyName: string
  currency: string
  tag?: string
}
