import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'
import type { useCardsStore } from '~/store/cards'
import type { useAccountsStore } from '~/store/accounts'
import type { useAccessCodesStore } from '~/store/accessCodes'
import type { useAuthStore } from '~/store/auth'
import type { useCorporatesStore } from '~/store/corporates'
import type { useConsumersStore } from '~/store/consumers'
import type { useErrorsStore } from '~/store/errors'
import type { useIdentityStore } from '~/store/identity'
import type { useSecureClientStore } from '~/store/secureClient'
import type { useLoaderStore } from '~/store/loader'
import type { useTransfersStore } from '~/store/transfers'
import type { useUsersStore } from '~/store/users'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import Countries from '~/assets/json/countries.json'

@Component
export default class BaseMixin extends Vue {
    get isRecaptchaEnabled(): boolean {
        // TODO: add to useBase composable
        return typeof this.useRuntimeConfig().public.recaptcha.siteKey !== 'undefined'
    }

    stores(store: string[]) {
        return initialiseStores(store)
    }

    // TODO: Remove upon full migration
    get cardStore() {
        return this.stores(['cards']) as useCardsStore
    }

    get accountStore() {
        return this.stores(['accounts']) as useAccountsStore
    }

    get accessCodes() {
        return this.stores(['accessCodes']) as useAccessCodesStore
    }

    get authStore() {
        return this.stores(['auth']) as useAuthStore
    }

    get corporatesStore() {
        return this.stores(['corporates']) as useCorporatesStore
    }

    get consumersStore() {
        return this.stores(['consumers']) as useConsumersStore
    }

    get errorStore() {
        return this.stores(['errors']) as useErrorsStore
    }

    get identityStore() {
        return this.stores(['identity']) as useIdentityStore
    }

    get loaderStore() {
        return this.stores(['loader']) as useLoaderStore
    }

    get secureClientStore() {
        return this.stores(['secureClient']) as useSecureClientStore
    }

    get transfersStore() {
        return this.stores(['transfers']) as useTransfersStore
    }

    get usersStore() {
        return this.stores(['users']) as useUsersStore
    }

    get isConsumer() {
        return this.authStore.isConsumer
    }

    get isCorporate() {
        return this.authStore.isCorporate
    }

    get isLoggedIn() {
        return this.authStore.isLoggedIn
    }

    get identityRegCountryIsUK() {
        return this.isConsumer ? this.consumersStore.isUk : this.corporatesStore.isUk
    }

    get cardJurisdictionProfileId() {
        if (this.isConsumer) {
            if (this.consumer && this.identityRegCountryIsUK) {
                return this.useRuntimeConfig().public.profileId.managed_cards_consumers_uk
            }
            return this.useRuntimeConfig().public.profileId.managed_cards_consumers
        } else {
            if (this.identityRegCountryIsUK) {
                return this.useRuntimeConfig().public.profileId.managed_cards_corporates_uk
            }
            return this.useRuntimeConfig().public.profileId.managed_cards_corporates
        }
    }

    get accountJurisdictionProfileId() {
        if (this.isConsumer) {
            if (this.consumer && this.identityRegCountryIsUK) {
                return this.useRuntimeConfig().public.profileId.managed_accounts_consumers_uk
            }
            return this.useRuntimeConfig().public.profileId.managed_accounts_consumers
        } else {
            if (this.identityRegCountryIsUK) {
                return this.useRuntimeConfig().public.profileId.managed_accounts_corporates_uk
            }
            return this.useRuntimeConfig().public.profileId.managed_accounts_corporates
        }
    }

    get profileBaseCurrency() {
        return (
            (this.isConsumer
                ? this.consumersStore.consumerState.consumer?.baseCurrency
                : this.corporatesStore.corporateState.corporate?.baseCurrency) || null
        )
    }

    get consumer(): ConsumerModel | null {
        return this.consumersStore.consumerState.consumer
    }

    get isConsumerPopulated() {
        return this.consumer && this.isConsumer
    }

    get isCorporatePopulated() {
        return this.corporate && this.isCorporate
    }

    get rootName(): string {
        if (this.isConsumerPopulated) {
            return this.consumersStore.consumerState.consumer!.rootUser.name
        } else if (this.isCorporatePopulated) {
            return this.corporatesStore.corporateState.corporate!.rootUser.name
        } else {
            return 'noname'
        }
    }

    get rootSurname(): string {
        if (this.isConsumerPopulated) {
            return this.consumersStore.consumerState.consumer!.rootUser.surname
        } else if (this.isCorporatePopulated) {
            return this.corporatesStore.corporateState.corporate!.rootUser.surname
        }
        return 'nosurname'
    }

    get rootFullName(): string {
        return `${this.rootName} ${this.rootSurname}`
    }

    get corporate() {
        return this.corporatesStore.corporateState.corporate
    }

    get rootUserEmail() {
        return this.isConsumer ? this.consumer?.rootUser.email : this.corporate?.rootUser.email
    }

    get countiesOptions() {
        return Countries.map((_c) => {
            return {
                text: _c.name,
                value: _c['alpha-2'],
            }
        })
    }

    get mobileCountries(): string[] {
        return Countries.map((_c) => {
            return _c['alpha-2']
        })
    }

    get countryOptionsWithDefault() {
        const _default: [any] = [{ ...DefaultSelectValueConst }]
        _default.push(...this.countiesOptions)
        return _default
    }

    get identityVerified(): boolean {
        if (this.authStore.isConsumer) {
            return (
                this.consumersStore.consumerState.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
            )
        }

        return this.corporatesStore.corporateState.kyb?.kybStatus === KYBStatusEnum.APPROVED
    }

    get pendingData() {
        /**
         * Flag to show we are waiting for
         * application programme data and any pending $fetch
         */
        return !this.$fetchState || this.$fetchState.pending
    }

    get fetchHasError() {
        /**
         * Flag to show if $fetch has error
         */
        return this.$fetchState?.error !== null
    }

    get pendingDataOrError() {
        return this.pendingData || this.fetchHasError
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    goToIndex() {
        return this.$router.push('/')
    }

    goToVerify() {
        return this.$router.push({
            path: '/login/verify',
            query: {
                email: this.rootUserEmail,
                send: 'true',
            },
        })
    }

    doLogout() {
        return this.authStore.logout().then(this.redirectToLogin)
    }

    redirectToLogin() {
        this.$router.push('/login')
    }

    showSuccessToast(msg?: string, title?: string) {
        return this.$weavrToast(msg !== undefined ? msg : 'All changes have been saved', {
            title: title !== undefined ? title : 'Changes saved',
            variant: 'success',
        })
    }

    showErrorToast(msg?: string, title?: string) {
        return this.$weavrToast(msg !== undefined ? msg : 'An error has occurred while saving', {
            title: title !== undefined ? title : 'Error',
            variant: 'danger',
        })
    }

    setSCAstorage() {
        localStorage.setItem('stepUp', 'FALSE')
        localStorage.setItem('scaSmsSent', 'FALSE')
    }

    useRuntimeConfig() {
        // TODO: Remove this on full migration
        return this.$config
    }
}
