import { CorporateUser } from '~/api/Models/Corporates/CorporateUser'

export interface CorporateUsers {
  user: CorporateUser[]
  count: number
  responseCount: number
}
