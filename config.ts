export default {
  api: {
    baseUrl: process.env.BASE_URL,
    tenantId: process.env.TENANT_ID,
    programmeId: '' + process.env.PROGRAMME_ID,
    secretKey: process.env.SECRET_KEY,
    sharedKey: process.env.SHARED_KEY
  },
  profileId: {
    corporates: process.env.CORPORATES_PROFILE_ID,
    managed_accounts: process.env.MANAGED_ACCOUNTS_PROFILE_ID,
    transfers: process.env.TRANSFERS_PROFILE_ID,
    managed_cards: process.env.MANAGED_CARDS_PROFILE_ID
  }
}
