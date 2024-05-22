import { computed, getCurrentInstance, useRouter } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'
import Countries from '~/static/json/countries.json'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'

export const useBase = () => {
    const { proxy: root } = getCurrentInstance() || {}
    const router = useRouter()
    const { auth, consumers, corporates } = useStores(['auth', 'consumers', 'corporates'])

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const isConsumer = computed(() => {
        return auth?.isConsumer
    })

    const isCorporate = computed(() => {
        return auth?.isCorporate
    })

    const isLoggedIn = computed(() => {
        return auth?.isLoggedIn
    })

    const identityRegCountryIsUK = computed(() => {
        return isConsumer.value ? consumers?.isUk : corporates?.isUk
    })

    const consumer = computed(() => {
        return consumers?.consumerState.consumer
    })

    const corporate = computed(() => {
        return corporates?.corporateState.corporate
    })

    const isConsumerPopulated = computed(() => {
        return consumer.value && isConsumer.value
    })

    const isCorporatePopulated = computed(() => {
        return corporate.value && isCorporate.value
    })

    const rootName = computed(() => {
        if (isConsumerPopulated) {
            return consumer.value?.rootUser.name
        } else if (isCorporatePopulated) {
            return corporate.value?.rootUser.name
        }
        return 'noname'
    })

    const rootSurname = computed(() => {
        if (isConsumerPopulated) {
            return consumer.value?.rootUser.surname
        } else if (isCorporatePopulated) {
            return corporate.value?.rootUser.surname
        }
        return 'nosurname'
    })

    const rootFullName = computed(() => {
        return `${rootName.value} ${rootSurname.value}`
    })

    const rootUserEmail = computed(() => {
        return isConsumer ? consumer.value?.rootUser.email : corporate.value?.rootUser.email
    })

    const cardJurisdictionProfileId = computed(() => {
        if (isConsumer.value) {
            if (consumer.value && identityRegCountryIsUK.value) {
                return root?.$config.profileId.managed_cards_consumers_uk
            }
            return root?.$config.profileId.managed_cards_consumers
        }

        if (identityRegCountryIsUK.value) {
            return root?.$config.profileId.managed_cards_corporates_uk
        }
        return root?.$config.profileId.managed_cards_corporates
    })

    const accountJurisdictionProfileId = computed(() => {
        if (isConsumer.value) {
            if (consumer.value && identityRegCountryIsUK.value) {
                return root?.$config.profileId.managed_accounts_consumers_uk
            }
            return root?.$config.profileId.managed_accounts_consumers
        }

        if (identityRegCountryIsUK.value) {
            return root?.$config.profileId.managed_accounts_corporates_uk
        }
        return root?.$config.profileId.managed_accounts_corporates
    })

    const profileBaseCurrency = computed(() => {
        return isConsumer.value
            ? consumer.value?.baseCurrency
            : corporate.value?.baseCurrency ?? null
    })

    const identityVerified = computed(() => {
        if (isConsumer.value) {
            return consumers?.consumerState.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
        }
        return corporates?.corporateState.kyb?.kybStatus === KYBStatusEnum.APPROVED
    })

    const countriesOptions = Countries.map((_c) => {
        return {
            text: _c.name,
            value: _c['alpha-2'],
        }
    })

    const countryOptionsWithDefault = computed(() => {
        const _default: [any] = [{ ...DefaultSelectValueConst }]
        _default.push(...countriesOptions)
        return _default
    })

    const mobileCountries = Countries.map((_c) => {
        return _c['alpha-2']
    })

    const pendingData = computed(() => !root!.$fetchState || root!.$fetchState.pending)
    const fetchHasError = computed(() => root!.$fetchState?.error !== null)
    const pendingDataOrError = computed(() => pendingData.value || fetchHasError.value)

    const goToIndex = () => {
        return router.push('/')
    }

    const redirectToLogin = () => {
        return router.push('/login')
    }

    const goToVerify = () => {
        return router.push({
            path: '/login/verify',
            query: {
                email: rootUserEmail.value,
                send: 'true',
            },
        })
    }

    const doLogout = () => {
        return auth?.logout().then(redirectToLogin)
    }

    const showSuccessToast = (msg?: string, title?: string) => {
        return root?.$weavrToast(msg ?? 'All changes have been saved', {
            title: title ?? 'Changes saved',
            variant: 'success',
        })
    }

    const showErrorToast = (msg?: string, title?: string) => {
        return root?.$weavrToast(msg ?? 'An error has occurred while saving', {
            title: title ?? 'Error',
            variant: 'danger',
        })
    }

    const setSCAStorage = () => {
        localStorage.setItem('stepUp', 'FALSE')
        localStorage.setItem('scaSmsSent', 'FALSE')
    }

    return {
        sleep,
        isConsumer,
        isCorporate,
        isLoggedIn,
        identityRegCountryIsUK,
        consumer,
        corporate,
        isConsumerPopulated,
        isCorporatePopulated,
        rootName,
        rootSurname,
        rootFullName,
        rootUserEmail,
        cardJurisdictionProfileId,
        accountJurisdictionProfileId,
        profileBaseCurrency,
        identityVerified,
        countriesOptions,
        countryOptionsWithDefault,
        mobileCountries,
        pendingData,
        pendingDataOrError,
        goToIndex,
        goToVerify,
        redirectToLogin,
        doLogout,
        showSuccessToast,
        showErrorToast,
        setSCAStorage,
    }
}
