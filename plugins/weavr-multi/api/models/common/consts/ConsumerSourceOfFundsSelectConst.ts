import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'

export const ConsumerSourceOfFundsSelectConst: {
    value: ConsumerSourceOfFundTypeEnum
    text: string
}[] = [
    { ...DefaultSelectValueConst },
    { value: ConsumerSourceOfFundTypeEnum.PERSONAL_SAVINGS, text: 'Personal savings' },
    { value: ConsumerSourceOfFundTypeEnum.FAMILY_SAVINGS, text: 'Family savings' },
    { value: ConsumerSourceOfFundTypeEnum.LABOUR_CONTRACT, text: 'Labour contract' },
    { value: ConsumerSourceOfFundTypeEnum.CIVIL_CONTRACT, text: 'Civil contract' },
    { value: ConsumerSourceOfFundTypeEnum.RENT, text: 'Rent' },
    {
        value: ConsumerSourceOfFundTypeEnum.FUNDS_FROM_OTHER_AUXILIARY_SOURCES,
        text: 'Funds from other auxiliary sources',
    },
    { value: ConsumerSourceOfFundTypeEnum.SALE_OF_MOVABLE_ASSETS, text: 'Sale of movable assets' },
    { value: ConsumerSourceOfFundTypeEnum.SALE_OF_REAL_ESTATE, text: 'Sale of real estate' },
    {
        value: ConsumerSourceOfFundTypeEnum.ORDINARY_BUSINESS_ACTIVITY,
        text: 'Ordinary business activity',
    },
    { value: ConsumerSourceOfFundTypeEnum.DIVIDENDS, text: 'Dividends' },
    {
        value: ConsumerSourceOfFundTypeEnum.LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNION,
        text: 'Loan from financial institutions/credit unions',
    },
    {
        value: ConsumerSourceOfFundTypeEnum.LOAN_FROM_THIRD_PARTIES,
        text: 'Loan from third parties',
    },
    { value: ConsumerSourceOfFundTypeEnum.INHERITANCE, text: 'Inheritance' },
    {
        value: ConsumerSourceOfFundTypeEnum.SALE_OF_COMPANY_SHARES_BUSINESS,
        text: 'Sale of company shares/business',
    },
    { value: ConsumerSourceOfFundTypeEnum.OTHER, text: 'Other' },
]
