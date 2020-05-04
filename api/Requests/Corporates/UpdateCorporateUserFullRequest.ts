import { CorporateUser } from '~/api/Models/Corporates/CorporateUser'

export interface UpdateCorporateUserFullRequest {
  corporateId: number
  userId: number
  body: Nullable<Partial<CorporateUser>>
}
