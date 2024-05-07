import { z } from 'zod'
import { IDSchema } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { IndustryTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import {
    CorporatesRootUserRequestSchema,
    INITIAL_CORPORATES_ROOT_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CorporatesRootUserRequest'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    CompanyRequestSchema,
    INITIAL_COMPANY_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CompanyRequest'

const CreateCorporateRequestSchema = z.object({
    profileId: IDSchema,
    tag: z.string().optional(),
    rootUser: CorporatesRootUserRequestSchema,
    company: CompanyRequestSchema,
    industry: IndustryTypeEnumSchema,
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema,
    sourceOfFundsOther: z.string().optional(),
    acceptedTerms: z.literal<boolean>(true),
    ipAddress: z.string(),
    baseCurrency: CurrencyEnumSchema,
    feeGroup: z.string().optional(),
})

type CreateCorporateRequest = z.infer<typeof CreateCorporateRequestSchema>
const INITIAL_CREATE_CORPORATE_REQUEST = {
    profileId: undefined,
    tag: undefined,
    rootUser: { ...INITIAL_CORPORATES_ROOT_USER_REQUEST },
    company: { ...INITIAL_COMPANY_REQUEST },
    industry: null,
    sourceOfFunds: null,
    sourceOfFundsOther: undefined,
    acceptedTerms: undefined,
    ipAddress: undefined,
    baseCurrency: undefined,
    feeGroup: undefined,
} as unknown as CreateCorporateRequest

export { CreateCorporateRequestSchema, CreateCorporateRequest, INITIAL_CREATE_CORPORATE_REQUEST }
