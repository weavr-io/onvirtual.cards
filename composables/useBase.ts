import { computed, getCurrentInstance } from 'vue'
import { initialiseStores } from '~/utils/store-accessor'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { useCardsStore } from '~/store/cards'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import Countries from '~/assets/json/countries.json'

export function useBase() {
    const { proxy: root } = getCurrentInstance() || {}
    const stores = initialiseStores(root!.$store)
    const isLoggedIn = computed(() => stores.auth.isLoggedIn)

    // stores
    const cardStore = useCardsStore()

    const pendingData = computed(() => !root!.$fetchState || root!.$fetchState.pending)
    const fetchHasError = computed(() => root!.$fetchState?.error !== null)
    const pendingDataOrError = computed(() => pendingData.value || fetchHasError.value)

    const isConsumer = computed(() => stores.auth.isConsumer)
    const isCorporate = computed(() => stores.auth.isCorporate)
    const consumer = computed<ConsumerModel | null>(() => stores.consumers.consumer)
    const corporate = computed<CorporateModel | null>(() => stores.corporates.corporate)
    const isConsumerPopulated = computed(() => consumer.value && isConsumer)
    const isCorporatePopulated = computed(() => corporate.value && isCorporate)
    const isConsumerAndPopulated = computed(() => isConsumerPopulated.value && consumer.value)
    const isCorporateAndPopulated = computed(() => isCorporatePopulated.value && corporate.value)
    const corporateKyB = computed(() => stores.corporates.kyb)
    const corporateKyBStatus = computed(() => corporateKyB.value?.kybStatus)
    const consumerKyC = computed(() => stores.consumers.kyc)
    const consumerKyCStatus = computed(() => consumerKyC.value?.fullDueDiligence)

    const identityId = computed(() => stores.auth.identityId)
    const rootFullName = computed<string>(() => `${rootName.value} ${rootSurname.value}`)
    const rootUserEmail = computed(() =>
        isConsumer.value ? consumer.value?.rootUser.email : corporate.value?.rootUser.email,
    )

    const accountProfileId = computed<string>(() =>
        isConsumer.value
            ? useRuntimeConfig().public.profileId.managed_accounts_consumers!
            : useRuntimeConfig().public.profileId.managed_accounts_corporates!,
    )

    const cardProfileId = computed(() =>
        isConsumer.value
            ? useRuntimeConfig().public.profileId.managed_cards_consumers!
            : useRuntimeConfig().public.profileId.managed_cards_corporates!,
    )

    const profileBaseCurrency = computed(() =>
        isConsumer.value ? consumer.value?.baseCurrency : corporate.value?.baseCurrency ?? null,
    )

    const rootName = computed<string>(() => {
        if (isConsumerAndPopulated.value) {
            return consumer.value!.rootUser.name
        } else if (isCorporateAndPopulated.value) {
            return corporate.value!.rootUser.name
        }

        return 'noname'
    })

    const rootSurname = computed<string>(() => {
        if (isConsumerAndPopulated.value) {
            return consumer.value!.rootUser.surname
        } else if (isCorporateAndPopulated.value) {
            return corporate.value!.rootUser.surname
        }

        return 'nosurname'
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
        const _default = [{ ...DefaultSelectValueConst }]
        _default.push(...countiesOptions.value)

        return _default
    })

    const identityVerified = computed<boolean>(() => {
        if (isConsumer.value) {
            return consumerKyCStatus.value === KYCStatusEnum.APPROVED
        }

        return corporateKyBStatus.value === KYBStatusEnum.APPROVED
    })

    const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const goToIndex = () => {
        return root!.$router.push('/')
    }

    const goToVerify = () => {
        return root!.$router.push({
            path: '/login/verify',
            query: {
                email: rootUserEmail.value,
                send: 'true',
            },
        })
    }

    const doLogout = () => {
        return stores.auth.logout().then(redirectToLogin)
    }

    const redirectToLogin = () => {
        root!.$router.push('/login')
    }

    const showSuccessToast = (msg?: string, title?: string) => {
        return root!.$weavrToast(msg ?? 'All changes have been saved', {
            title: title ?? 'Changes saved',
            variant: 'success',
        })
    }

    const showErrorToast = (msg?: string, title?: string) => {
        return root!.$weavrToast(msg ?? 'An error has occurred while saving', {
            title: title ?? 'Error',
            variant: 'danger',
        })
    }

    const setSCAstorage = () => {
        localStorage.setItem('stepUp', 'FALSE')
        localStorage.setItem('scaSmsSent', 'FALSE')
    }

    const useRuntimeConfig = () => {
        // TODO: Remove this on full migration
        return root!.$config
    }

    return {
        root,
        stores,
        sleep,
        isConsumer,
        isCorporate,
        isLoggedIn,
        accountProfileId,
        cardProfileId,
        profileBaseCurrency,
        consumer,
        identityId,
        rootName,
        rootSurname,
        rootFullName,
        corporate,
        corporateKyBStatus,
        corporateKyB,
        consumerKyC,
        consumerKyCStatus,
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
        useRuntimeConfig,
        cardStore,
    }
}
