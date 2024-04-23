import { Component, Vue } from 'nuxt-property-decorator'
import type { StoreType } from '~/local/models/store'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import Countries from '~/static/json/countries.json'
import { useAccessCodesStore } from '~/store/accessCodes'
import { useAccountsStore } from '~/store/accounts'
import { useAuthStore } from '~/store/auth'
import { useCardsStore } from '~/store/cards'
import { useConsumersStore } from '~/store/consumers'
import { useCorporatesStore } from '~/store/corporates'
import { useErrorsStore } from '~/store/errors'
import { useIdentityStore } from '~/store/identity'
import { useLoaderStore } from '~/store/loader'
import { useSecureClientStore } from '~/store/secureClient'
import { useTransfersStore } from '~/store/transfers'
import type { useUsersStore } from '~/store/users'
import { initialiseStores as initialisePiniaStores } from '~/utils/pinia-store-accessor'

@Component
export default class BaseMixin extends Vue {
    get accessCodes() {
        return this.piniaStores(['accessCodes']).accessCodes as useAccessCodesStore
    }

    get accountsStore() {
        return this.piniaStores(['accounts']).accounts as useAccountsStore
    }

    get usersStore() {
        return this.piniaStores(['users']).users as useUsersStore
    }

    get loaderStore() {
        return this.piniaStores(['loader']).loader as useLoaderStore
    }

    get cardsStore() {
        return this.piniaStores(['cards']).cards as useCardsStore
    }

    get consumersStore() {
        return this.piniaStores(['consumers']).consumers as useConsumersStore
    }

    get corporatesStore() {
        return this.piniaStores(['corporates']).corporates as useCorporatesStore
    }

    get authStore() {
        return this.piniaStores(['auth']).auth as useAuthStore
    }

    get errorsStore() {
        return this.piniaStores(['errors']).errors as useErrorsStore
    }

    get identityStore() {
        return this.piniaStores(['identity']).identity as useIdentityStore
    }

    get secureClientStore() {
        return this.piniaStores(['secureClient']).secureClient as useSecureClientStore
    }

    get transfersStore() {
        return this.piniaStores(['transfers']).transfers as useTransfersStore
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
                return this.$config.profileId.managed_cards_consumers_uk
            }
            return this.$config.profileId.managed_cards_consumers
        } else {
            if (this.identityRegCountryIsUK) {
                return this.$config.profileId.managed_cards_corporates_uk
            }
            return this.$config.profileId.managed_cards_corporates
        }
    }

    get accountJurisdictionProfileId() {
        if (this.isConsumer) {
            if (this.consumer && this.identityRegCountryIsUK) {
                return this.$config.profileId.managed_accounts_consumers_uk
            }
            return this.$config.profileId.managed_accounts_consumers
        } else {
            if (this.identityRegCountryIsUK) {
                return this.$config.profileId.managed_accounts_corporates_uk
            }
            return this.$config.profileId.managed_accounts_corporates
        }
    }

    get profileBaseCurrency() {
        return (
            (this.isConsumer
                ? this.consumersStore.consumerState.consumer?.baseCurrency
                : this.corporatesStore.corporateState.corporate?.baseCurrency) ?? null
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
        } else {
            return this.corporatesStore.corporateState.kyb?.kybStatus === KYBStatusEnum.APPROVED
        }
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

    piniaStores(store: (keyof StoreType)[]) {
        return initialisePiniaStores(store)
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
        return this.$weavrToast(msg ?? 'All changes have been saved', {
            title: title ?? 'Changes saved',
            variant: 'success',
        })
    }

    showErrorToast(msg?: string, title?: string) {
        return this.$weavrToast(msg ?? 'An error has occurred while saving', {
            title: title ?? 'Error',
            variant: 'danger',
        })
    }

    setSCAstorage() {
        localStorage.setItem('stepUp', 'FALSE')
        localStorage.setItem('scaSmsSent', 'FALSE')
    }
}
