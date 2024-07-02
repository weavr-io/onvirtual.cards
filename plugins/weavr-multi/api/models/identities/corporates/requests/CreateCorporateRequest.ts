import { z } from 'zod'
import { IDSchema } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { IndustryTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import {
    CorporatesRootUserRequestSchema,
    INITIAL_CORPORATES_ROOT_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CorporatesRootUserRequest'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    CompanyRequestSchema,
    INITIAL_COMPANY_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CompanyRequest'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import {
    CorporateSourceOfFundTypeEnumSchema,
    PREDEFINED_CORPORATE_SOURCE_OF_FUND,
} from '~/plugins/weavr-multi/api/models/identities/corporates'

const CreateCorporateRequestSchema = z.object({
    profileId: IDSchema,
    tag: preprocessEmptyAsUndefined(z.string().optional()),
    rootUser: CorporatesRootUserRequestSchema,
    company: CompanyRequestSchema,
    industry: IndustryTypeEnumSchema,
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema,
    sourceOfFundsOther: preprocessEmptyAsUndefined(z.string().optional()),
    acceptedTerms: preprocessEmptyAsUndefined(z.literal<boolean>(true)),
    ipAddress: preprocessEmptyAsUndefined(z.string()),
    baseCurrency: CurrencyEnumSchema,
    feeGroup: preprocessEmptyAsUndefined(z.string().optional()),
})

const CreateCorporateFormSchema = z.intersection(
    z.discriminatedUnion('sourceOfFunds', [
        z.object({
            // Ignoring for the time being because z.enum is giving type error when used with referenced object.
            // @ts-ignore
            sourceOfFunds: z.enum(PREDEFINED_CORPORATE_SOURCE_OF_FUND),
            sourceOfFundsOther: preprocessEmptyAsUndefined(z.string().optional()),
        }),

        z.object({
            sourceOfFunds: z.literal('OTHER'),
            sourceOfFundsOther: preprocessEmptyAsUndefined(z.string()),
        }),
    ]),
    CreateCorporateRequestSchema.omit({
        sourceOfFunds: true,
        sourceOfFundsOther: true,
    }),
)

type CreateCorporateRequest = z.infer<typeof CreateCorporateRequestSchema>

const INITIAL_CREATE_CORPORATE_REQUEST = () => {
    return {
        profileId: undefined,
        tag: undefined,
        rootUser: { ...INITIAL_CORPORATES_ROOT_USER_REQUEST() },
        company: { ...INITIAL_COMPANY_REQUEST() },
        industry: null,
        sourceOfFunds: null,
        sourceOfFundsOther: undefined,
        acceptedTerms: undefined,
        ipAddress: undefined,
        baseCurrency: undefined,
        feeGroup: undefined,
    } as unknown as CreateCorporateRequest
}

export {
    CreateCorporateFormSchema,
    CreateCorporateRequestSchema,
    CreateCorporateRequest,
    INITIAL_CREATE_CORPORATE_REQUEST,
}
