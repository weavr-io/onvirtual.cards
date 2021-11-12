import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'

export const SourceOfFundsSelectConst: { value: CorporateSourceOfFundTypeEnum; text: string }[] = [
  { ...DefaultSelectValueConst },
  { value: CorporateSourceOfFundTypeEnum.LABOUR_CONTRACT, text: 'Labour contract' },
  { value: CorporateSourceOfFundTypeEnum.CIVIL_CONTRACT, text: 'Civil contract' },
  { value: CorporateSourceOfFundTypeEnum.RENT, text: 'Rent' },
  {
    value: CorporateSourceOfFundTypeEnum.FUNDS_FROM_OTHER_AUXILIARY_SOURCES,
    text: 'Funds from other auxiliary sources'
  },
  { value: CorporateSourceOfFundTypeEnum.SALE_OF_MOVABLE_ASSETS, text: 'Sale of movable assets' },
  { value: CorporateSourceOfFundTypeEnum.SALE_OF_REAL_ESTATE, text: 'Sale of real estate' },
  { value: CorporateSourceOfFundTypeEnum.ORDINARY_BUSINESS_ACTIVITY, text: 'Ordinary business activity' },
  { value: CorporateSourceOfFundTypeEnum.DIVIDENDS, text: 'Dividends' },
  {
    value: CorporateSourceOfFundTypeEnum.LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS,
    text: 'Loan from financial institutions/credit unions'
  },
  { value: CorporateSourceOfFundTypeEnum.LOAN_FROM_THIRD_PARTIES, text: 'Loan from third parties' },
  { value: CorporateSourceOfFundTypeEnum.SALE_OF_COMPANY_SHARES_BUSINESS, text: 'Sale of company shares/business' },
  { value: CorporateSourceOfFundTypeEnum.OTHER, text: 'Other' }
]
