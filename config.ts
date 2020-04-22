export default {
  api: {
    baseUrl: process.env.BASE_URL,
    tenantId: process.env.TENANT_ID,
    programmeId: '' + process.env.APPLICATION_ID,
    secretKey: process.env.SECRET_KEY,
    sharedKey: process.env.SHARED_KEY
  },
  profileId: {
    consumers: process.env.CONSUMERS_PROFILE_ID,
    corporates: process.env.CORPORATES_PROFILE_ID,
    managed_cards_consumers: process.env.MANAGED_CARDS_CONSUMERS_PROFILE_ID,
    managed_cards_corporates: process.env.MANAGED_CARDS_CORPORATES_PROFILE_ID,
    managed_accounts_consumers: process.env.MANAGED_ACCOUNTS_CONSUMERS_PROFILE_ID,
    managed_accounts_corporates: process.env.MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID,
    transfers: process.env.TRANSFERS_PROFILE_ID,
    send: process.env.SEND_PROFILE_ID
  },
  app: {
    kyb_required: process.env.KYB_REQUIRED ? JSON.parse(process.env.KYB_REQUIRED) : true,
    view_register: process.env.VIEW_REGISTER ? JSON.parse(process.env.VIEW_REGISTER) : true,
    sumsub_enabled: process.env.SUM_SUB ? JSON.parse(process.env.SUM_SUB) : false
  }
}
