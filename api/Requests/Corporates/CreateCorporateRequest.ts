import { Corporate } from '~/api/Models/Corporates/Corporate'

export type CreateCorporateRequest = Partial<Corporate> & {
  companyName: string
  ipAddress: string
  rootCompanyPosition: string
  rootEmail: string
  rootMobileCountryCode: string
  rootMobileNumber: string
  rootName: string
  rootSurname: string
  rootTitle: string
}
