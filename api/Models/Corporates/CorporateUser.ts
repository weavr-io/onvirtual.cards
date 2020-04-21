import { CorporateUserType } from '~/api/Enums/Corporates/CorporateUserType'

export interface CorporateUser {
  id: number
  type: CorporateUserType
  identity: {
    type: string
    id: number
  }
  username?: string
  title?: string
  name: string
  surname: string
  email: string
  active?: boolean
  companyPosition?: string
  mobileCountryCode?: string
  mobileNumber?: string
}
