import { z } from 'zod'

enum CorporateSourceOfFundTypeEnum {
    LABOUR_CONTRACT = 'LABOUR_CONTRACT',
    CIVIL_CONTRACT = 'CIVIL_CONTRACT',
    RENT = 'RENT',
    FUNDS_FROM_OTHER_AUXILIARY_SOURCES = 'FUNDS_FROM_OTHER_AUXILIARY_SOURCES',
    SALE_OF_MOVABLE_ASSETS = 'SALE_OF_MOVABLE_ASSETS',
    SALE_OF_REAL_ESTATE = 'SALE_OF_REAL_ESTATE',
    ORDINARY_BUSINESS_ACTIVITY = 'ORDINARY_BUSINESS_ACTIVITY',
    DIVIDENDS = 'DIVIDENDS',
    LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS = 'LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS',
    LOAN_FROM_THIRD_PARTIES = 'LOAN_FROM_THIRD_PARTIES',
    SALE_OF_COMPANY_SHARES_BUSINESS = 'SALE_OF_COMPANY_SHARES_BUSINESS',
    OTHER = 'OTHER',
}

const CorporateSourceOfFundTypeEnumSchema = z.nativeEnum(CorporateSourceOfFundTypeEnum)

const PREDEFINED_CORPORATE_SOURCE_OF_FUND = Object.values(CorporateSourceOfFundTypeEnum).filter(
    (value) => value !== CorporateSourceOfFundTypeEnum.OTHER,
)

type CorporateSourceOfFundTypeEnumType = z.infer<typeof CorporateSourceOfFundTypeEnumSchema>

export {
    CorporateSourceOfFundTypeEnumSchema,
    type CorporateSourceOfFundTypeEnumType,
    PREDEFINED_CORPORATE_SOURCE_OF_FUND,
    CorporateSourceOfFundTypeEnum,
}
