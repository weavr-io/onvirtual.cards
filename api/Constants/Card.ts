export enum CardType {
  NO_CARD_TYPE = 'NO_CARD_TYPE',
  VIRTUAL = 'VIRTUAL',
  PLASTIC = 'PLASTIC'
}

export enum CardBrand {
  NO_CARD_BRAND = 'NO_CARD_BRAND',
  AMEX = 'AMEX',
  CHINAUNIONPAY = 'CHINAUNIONPAY',
  DINERS = 'DINERS',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  MASTERCARD = 'MASTERCARD',
  MAESTRO = 'MAESTRO',
  SOLO = 'SOLO',
  VISA = 'VISA',
  VISADEBIT = 'VISADEBIT',
  VISAELECTRON = 'VISAELECTRON',
  VISAPURCHASING = 'VISAPURCHASING',
  VERVE = 'VERVE',
  UATP = 'UATP'
}

export enum CardRenewalType {
  'NO_CARD_RENEWAL_TYPE' = 'NO_CARD_RENEWAL_TYPE',
  'AUTO_RENEW' = 'AUTO_RENEW',
  'ASK' = 'ASK',
  'NO_RENEW' = 'NO_RENEW'
}

export const CardTypeOptions = [
  {
    text: CardType.VIRTUAL,
    value: CardType.VIRTUAL
  }
]

export const CardBrandOptions = [
  { text: CardBrand.MASTERCARD, value: CardBrand.MASTERCARD }
]
