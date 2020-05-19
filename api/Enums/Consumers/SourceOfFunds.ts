export enum SourceOfFunds {
  'PERSONAL_SAVINGS' = 'PERSONAL_SAVINGS',
  'FAMILY_SAVINGS' = 'FAMILY_SAVINGS',
  'LABOUR_CONTRACT' = 'LABOUR_CONTRACT',
  'CIVIL_CONTRACT' = 'CIVIL_CONTRACT',
  'RENT' = 'RENT',
  'FUNDS_FROM_OTHER_AUXILIARY_SOURCES' = 'FUNDS_FROM_OTHER_AUXILIARY_SOURCES',
  'SALE_OF_MOVABLE_ASSETS' = 'SALE_OF_MOVABLE_ASSETS',
  'SALE_OF_REAL_ESTATE' = 'SALE_OF_REAL_ESTATE',
  'ORDINARY_BUSINESS_ACTIVITY' = 'ORDINARY_BUSINESS_ACTIVITY',
  'DIVIDENDS' = 'DIVIDENDS',
  'LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS' = 'LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS',
  'LOAN_FROM_THIRD_PARTIES' = 'LOAN_FROM_THIRD_PARTIES',
  'INHERITANCE' = 'INHERITANCE',
  'SALE_OF_COMPANY_SHARES_BUSINESS' = 'SALE_OF_COMPANY_SHARES_BUSINESS',
  'OTHER' = 'OTHER'
}

export const SourceOfFundsOptions = [
  { text: 'Personal savings', value: SourceOfFunds.PERSONAL_SAVINGS },
  { value: SourceOfFunds.FAMILY_SAVINGS, text: 'Family savings' },
  { value: SourceOfFunds.LABOUR_CONTRACT, text: 'Labour contract' },
  { value: SourceOfFunds.CIVIL_CONTRACT, text: 'Civil contract' },
  { value: SourceOfFunds.RENT, text: 'Rent' },
  { value: SourceOfFunds.FUNDS_FROM_OTHER_AUXILIARY_SOURCES, text: 'Funds from other auxiliary sources' },
  { value: SourceOfFunds.SALE_OF_MOVABLE_ASSETS, text: 'Sale of movable assets' },
  { value: SourceOfFunds.SALE_OF_REAL_ESTATE, text: 'Sale of real estate' },
  { value: SourceOfFunds.ORDINARY_BUSINESS_ACTIVITY, text: 'Ordinary business activity' },
  { value: SourceOfFunds.DIVIDENDS, text: 'Dividends' },
  {
    value: SourceOfFunds.LOAN_FROM_FINANCIAL_INSTITUTIONS_CREDIT_UNIONS,
    text: 'Loan from financial institutions/credit unions'
  },
  { value: SourceOfFunds.LOAN_FROM_THIRD_PARTIES, text: 'Loan from third parties' },
  { value: SourceOfFunds.INHERITANCE, text: 'Inheritance' },
  { value: SourceOfFunds.SALE_OF_COMPANY_SHARES_BUSINESS, text: 'Sale of company shares/business' },
  { value: SourceOfFunds.OTHER, text: 'Other' }
]
