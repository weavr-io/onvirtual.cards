import { CorporateUser } from '~/api/Models/Corporates/CorporateUser'

export interface CreateCorporateUserFullRequest {
  request: Nullable<Partial<CorporateUser>>
  corporateId: string
}
