import { computed, reactive } from '~/node_modules/vue'
import { initialiseStores } from '~/utils/store-accessor'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

const Countries = require('~/static/json/countries.json')

export function useBase(root) {
    const stores = initialiseStores(root.$store)

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const isConsumer = computed(() => {
        return stores.auth.isConsumer
    })

    const isCorporate = computed(() => {
        return stores.auth.isCorporate
    })

    const isLoggedIn = computed(() => {
        return stores.auth.isLoggedIn
    })

    const accountProfileId = computed(() => {
        return isConsumer.value
            ? root.$config.profileId.managed_accounts_consumers!
            : root.$config.profileId.managed_accounts_corporates!
    })

    const cardProfileId = computed(() => {
        return isConsumer.value
            ? root.$config.profileId.managed_cards_consumers!
            : root.$config.profileId.managed_cards_corporates!
    })

    const profileBaseCurrency = computed(() => {
        return (
            (isConsumer.value
                ? stores.consumers.consumer?.baseCurrency
                : stores.corporates.corporate?.baseCurrency) || null
        )
    })

    const consumer = computed<ConsumerModel | null>(() => {
        return stores.consumers.consumer
    })

    const isConsumerPopulated = computed(() => {
        return consumer.value && isConsumer
    })

    const isCorporatePopulated = computed(() => {
        return corporate.value && isCorporate
    })

    const rootName = computed<string>(() => {
        if (isConsumerPopulated.value) {
            return stores.consumers.consumer!.rootUser.name
        } else if (isCorporatePopulated.value) {
            return stores.corporates.corporate!.rootUser.name
        } else return 'noname'
    })

    const rootSurname = computed<string>(() => {
        if (isConsumerPopulated.value) {
            return stores.consumers.consumer!.rootUser.surname
        } else if (isCorporatePopulated.value) {
            return stores.corporates.corporate!.rootUser.surname
        } else return 'nosurname'
    })

    const rootFullName = computed<string>(() => {
        return `${rootName.value} ${rootSurname.value}`
    })

    const corporate = computed(() => {
        return stores.corporates.corporate
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

    const mobileCountries = computed<string[]>(() => {
        return Countries.map((_c) => {
            return _c['alpha-2']
        })
    })

    const countryOptionsWithDefault = computed(() => {
        const _default: [any] = [{ ...DefaultSelectValueConst }]
        _default.push(...countiesOptions.value)
        return _default
    })

    const identityVerified = computed<boolean>(() => {
        if (stores.auth.isConsumer) {
            return stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
        } else {
            return stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
        }
    })

    function goToIndex() {
        return root.$router.push('/')
    }

    function goToVerify() {
        return root.$router.push({
            path: '/login/verify',
            query: {
                email: rootUserEmail.value,
                send: 'true',
            },
        })
    }

    function doLogout() {
        return stores.auth.logout().then(redirectToLogin)
    }

    function redirectToLogin() {
        root.$router.push('/login')
    }

    function showSuccessToast(msg?: string, title?: string) {
        return root.$weavrToast(msg !== undefined ? msg : 'All changes have been saved', {
            title: title !== undefined ? title : 'Changes saved',
            variant: 'success',
        })
    }

    function showErrorToast(msg?: string, title?: string) {
        return root.$weavrToast(msg !== undefined ? msg : 'An error has occurred while saving', {
            title: title !== undefined ? title : 'Error',
            variant: 'danger',
        })
    }

    const pendingData = computed(() => {
        /**
         * Flag to show we are waiting for
         * application programme data and any pending $fetch
         */
        return !root.$fetchState || root.$fetchState.pending
    })

    const fetchHasError = computed(() => {
        return root.$fetchState?.error !== null
    })

    const pendingDataOrError = computed(() => {
        return pendingData.value || fetchHasError.value
    })

    function setSCAstorage() {
        return pendingData.value || fetchHasError.value
    }

    const unRefs = reactive({
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
        mobileCountries,
        countryOptionsWithDefault,
        identityVerified,
        goToVerify,
        pendingDataOrError,
        setSCAstorage,
    })

    return {
        stores,
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
        mobileCountries,
        countryOptionsWithDefault,
        identityVerified,
        goToIndex,
        goToVerify,
        doLogout,
        showSuccessToast,
        showErrorToast,
        pendingDataOrError,
        setSCAstorage,
        unRefs,
    }
}
