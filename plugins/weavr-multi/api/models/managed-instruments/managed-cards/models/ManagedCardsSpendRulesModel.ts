export interface ManagedCardsSpendRulesModel {
    allowedMerchantCategories: string[]
    blockedMerchantCategories: string[]
    allowedMerchantIds: string[]
    blockedMerchantIds: string[]
    allowContactless: boolean
    allowAtm: boolean
    allowECommerce: boolean
    allowCashback: boolean
    allowCreditAuthorisations: boolean
    // spendLimit: SpendLimit
}
