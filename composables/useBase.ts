import { useStore } from 'vuex'
import { computed } from '~/node_modules/vue'
import { initialiseStores } from '~/utils/store-accessor'
import { useRouter } from '~/node_modules/vue-router'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

const Countries = require('~/static/json/countries.json')

export function useBase() {
  const router = useRouter()

  const stores = computed(() => {
    return initialiseStores(useStore())
  })

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const isConsumer = computed(() => {
    return stores.value.auth.isConsumer
  })

  const isCorporate = computed(() => {
    return stores.value.auth.isCorporate
  })

  const isLoggedIn = computed(() => {
    return stores.value.auth.isLoggedIn
  })

  const accountProfileId = computed(() => {
    return isConsumer.value
      ? this.$config.profileId.managed_accounts_consumers!
      : this.$config.profileId.managed_accounts_corporates!
  })

  const cardProfileId = computed(() => {
    return isConsumer.value
      ? this.$config.profileId.managed_cards_consumers!
      : this.$config.profileId.managed_cards_corporates!
  })

  const profileBaseCurrency = computed(() => {
    return (
      (isConsumer.value
        ? stores.value.consumers.consumer?.baseCurrency
        : stores.value.corporates.corporate?.baseCurrency) || null
    )
  })

  const consumer = computed<ConsumerModel | null>(() => {
    return stores.value.consumers.consumer
  })

  const rootName = computed<string>(() => {
    if (isConsumer.value) {
      return stores.value.consumers.consumer!.rootUser.name
    } else if (isCorporate.value) {
      return stores.value.corporates.corporate!.rootUser.name
    } else return 'noname'
  })

  const rootSurname = computed<string>(() => {
    if (isConsumer.value) {
      return stores.value.consumers.consumer!.rootUser.surname
    } else if (isCorporate.value) {
      return stores.value.corporates.corporate!.rootUser.surname
    } else return 'nosurname'
  })

  const rootFullName = computed<string>(() => {
    return `${rootName.value} ${rootSurname.value}`
  })

  const corporate = computed(() => {
    return stores.value.corporates.corporate
  })

  const rootUserEmail = computed(() => {
    return isConsumer.value ? consumer.value?.rootUser.email : corporate.value?.rootUser.email
  })

  const countiesOptions = computed(() => {
    return Countries.map((_c) => {
      return {
        text: _c.name,
        value: _c['alpha-2'],
      }
    })
  })

  const countryOptionsWithDefault = computed(() => {
    const _default: [any] = [{ ...DefaultSelectValueConst }]
    _default.push(...countiesOptions.value)
    return _default
  })

  const identityVerified = computed<boolean>(() => {
    if (stores.value.auth.isConsumer) {
      return stores.value.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
    } else {
      return stores.value.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
    }
  })

  function goToIndex() {
    return router.push('/')
  }

  function logout() {
    return stores.value.auth.logout()
  }

  function showSuccessToast(msg?: string, title?: string) {
    return this.$weavrToast(msg !== undefined ? msg : 'All changes have been saved', {
      title: title !== undefined ? title : 'Changes saved',
      variant: 'success',
    })
  }

  function showErrorToast(msg?: string, title?: string) {
    return this.$weavrToast(msg !== undefined ? msg : 'An error has occurred while saving', {
      title: title !== undefined ? title : 'Error',
      variant: 'danger',
    })
  }

  const pendingData = computed(() => {
    /**
     * Flag to show we are waiting for
     * application programme data and any pending $fetch
     */
    return !this.$fetchState || this.$fetchState.pending
  })

  const fetchHasError = computed(() => {
    return this.$fetchState?.error !== null
  })

  const pendingDataOrError = computed(() => {
    return pendingData.value || fetchHasError.value
  })

  return {
    stores,
    router,
    sleep,
    isConsumer,
    isCorporate,
    isLoggedIn,
    accountProfileId,
    cardProfileId,
    profileBaseCurrency,
    consumer,
    rootName,
    rootSurname,
    rootFullName,
    corporate,
    rootUserEmail,
    countiesOptions,
    countryOptionsWithDefault,
    identityVerified,
    goToIndex,
    logout,
    showSuccessToast,
    showErrorToast,
    pendingDataOrError,
  }
}
