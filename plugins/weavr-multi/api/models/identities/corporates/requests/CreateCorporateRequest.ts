import { z } from 'zod'
import { IDModel, IDSchema } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import {
    IndustryTypeEnum,
    IndustryTypeEnumSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import {
    CorporateSourceOfFundTypeEnum,
    CorporateSourceOfFundTypeEnumSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import {
    CorporatesRootUserRequest,
    CorporatesRootUserRequestSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CorporatesRootUserRequest'
import {
    CurrencyEnum,
    CurrencyEnumSchema,
} from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    CompanyRequest,
    CompanyRequestSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CompanyRequest'

export interface CreateCorporateRequest {
    profileId: IDModel
    tag?: string
    rootUser: CorporatesRootUserRequest
    company: CompanyRequest
    industry: IndustryTypeEnum
    sourceOfFunds: CorporateSourceOfFundTypeEnum
    sourceOfFundsOther?: string
    acceptedTerms: boolean
    ipAddress: string
    baseCurrency: CurrencyEnum
    feeGroup?: string
}

const CreateCorporateRequestSchema = z.object({
    profileId: IDSchema,
    tag: z.string().optional(),
    rootUser: CorporatesRootUserRequestSchema,
    company: CompanyRequestSchema,
    industry: IndustryTypeEnumSchema,
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema,
    sourceOfFundsOther: z.string().optional(),
    acceptedTerms: z.boolean(),
    ipAddress: z.string(),
    baseCurrency: CurrencyEnumSchema,
    feeGroup: z.string().optional(),
})

type CreateCorporatesRequestType = z.infer<typeof CreateCorporateRequestSchema>
const INITIAL_CREATE_CORPORATE_REQUEST = {
    profileId: undefined,
    tag: undefined,
    rootUser: undefined,
    company: undefined,
    industry: undefined,
    sourceOfFunds: undefined,
    sourceOfFundsOther: undefined,
    acceptedTerms: undefined,
    ipAddress: undefined,
    baseCurrency: undefined,
    feeGroup: undefined,
} as unknown as CreateCorporatesRequestType

export {
    CreateCorporateRequestSchema,
    CreateCorporatesRequestType,
    INITIAL_CREATE_CORPORATE_REQUEST,
}
