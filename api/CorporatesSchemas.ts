import { KYBState } from '~/api/Enums/KYBState'

export module CorporatesSchemas {
  export enum CompanyType {
    NO_TYPE = 'NO_TYPE', SOLE_TRADER = 'SOLE_TRADER', LLC = 'LLC'
  }

  export interface CreateCorporateRequest {
    profileId: any
    tag?: string
    companyName: string
    companyType: CompanyType
    supportEmail: string
    active?: boolean
    rootUsername?: string
    rootTitle: string
    rootName: string
    rootSurname: string
    rootEmail: string
    companyRegistrationNumber: string
    companyRegistrationAddress: string
    companyBusinessAddress: string
    registrationCountry: string
    companyRegistrationDate?: number
    acceptedTerms: boolean
    ipAddress: string
    rootCompanyPosition: string
    rootMobileCountryCode: string
    rootMobileNumber: string
    baseCurrency?: string
  }

  export interface Corporate {
    id: {
      type: string
      id: number
    }
    profileId: number
    tag?: string
    name: string
    companyType: CompanyType
    supportEmail: string
    active?: boolean
    creationTimestamp: number
    verifications: string[]
    companyRegistrationNumber: string
    companyRegistrationAddress: string
    companyBusinessAddress: string
    registrationCountry: string
    companyRegistrationDate: number
    acceptedTerms: boolean
    kyb: {
      rootEmailVerified: boolean
      rootMobileVerified: boolean
      basicCompanyChecksVerified: KYBState
      fullCompanyChecksVerified: KYBState
      enhancedCompanyChecksVerified: KYBState
      allowedLimit: number
      remainingLimit: number
    }
  }

  export interface CreateCorporatePasswordIdentity {
    corporateId: number
    request: {
      profileId: string
    }
  }

  export interface CreateCorporatePassword {
    corporateId: number
    request: {
      credentialType: string
      identityId: number
      password: {
        value: string
      }
    }
  }

  export interface CreateCorporateUserRequest {
    type: string
    username?: string
    title: string | null
    name: string
    surname: string
    email: string
    active?: boolean
    companyPosition: string
    mobileCountryCode: string
    mobileNumber: string
  }

  export interface CreateCorporateUserFullRequest {
    request: CreateCorporateUserRequest
    corporateId: string
  }
}
