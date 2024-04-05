import { computed, getCurrentInstance } from 'vue'
import { initialiseStores } from '~/utils/store-accessor'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { useCardsStore } from '~/store/cards'
import { useAccountsStore } from '~/store/accounts'
import { useAuthStore } from '~/store/auth'
import { useCorporatesStore } from '~/store/corporates'
import { useConsumersStore } from '~/store/consumers'
import { useIdentityStore } from '~/store/identity'
import { useLoaderStore } from '~/store/loader'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import Countries from '~/assets/json/countries.json'

export function useBase() {
    const { proxy: root } = getCurrentInstance() || {}

    // TODO: use initialiseStores()
    const cardStore = useCardsStore()
    const authStore = useAuthStore()
    const accountsStore = useAccountsStore()
    const corporatesStore = useCorporatesStore()
    const consumersStore = useConsumersStore()
    const identityStore = useIdentityStore()
    const loaderStore = useLoaderStore()

    const isLoggedIn = computed(() => authStore.hasAuthToken)
    const pendingData = computed(() => !root!.$fetchState || root!.$fetchState.pending)
    const fetchHasError = computed(() => root!.$fetchState?.error !== null)
    const pendingDataOrError = computed(() => pendingData.value || fetchHasError.value)

    const isConsumer = computed(() => authStore.isConsumer)
    const isCorporate = computed(() => authStore.isCorporate)
    const consumer = computed<ConsumerModel | null>(() => consumersStore.consumerState.consumer)
    const corporate = computed<CorporateModel | null>(
        () => corporatesStore.corporateState.corporate,
    )
    const isConsumerPopulated = computed(() => consumer.value && isConsumer)
    const isCorporatePopulated = computed(() => corporate.value && isCorporate)
    const isConsumerAndPopulated = computed(() => isConsumerPopulated.value && consumer.value)
    const isCorporateAndPopulated = computed(() => isCorporatePopulated.value && corporate.value)
    const corporateKyB = computed(() => corporatesStore.corporateState.kyb)
    const corporateKyBStatus = computed(() => corporateKyB.value?.kybStatus)
    const consumerKyC = computed(() => consumersStore.consumerState.kyc)
    const consumerKyCStatus = computed(() => consumerKyC.value?.fullDueDiligence)

    const identityId = computed(() => authStore.identityId)
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

    const stores = (store: string[]) => {
        return initialiseStores(store)
    }

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
        return authStore.logout().then(redirectToLogin)
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
        accountsStore,
        identityStore,
        loaderStore,
    }
}
