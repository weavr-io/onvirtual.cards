import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

const Countries = require('~/static/json/countries.json')

@Component
export default class BaseMixin extends Vue {
    get stores() {
        return initialiseStores(this.$store)
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    get isConsumer() {
        return this.stores.auth.isConsumer
    }

    get isCorporate() {
        return this.stores.auth.isCorporate
    }

    get isLoggedIn() {
        return this.stores.auth.isLoggedIn
    }

    get identityId() {
        return this.stores.auth.identityId
    }

    get accountProfileId() {
        return this.isConsumer
            ? this.$config.profileId.managed_accounts_consumers!
            : this.$config.profileId.managed_accounts_corporates!
    }

    get cardProfileId() {
        return this.isConsumer
            ? this.$config.profileId.managed_cards_consumers!
            : this.$config.profileId.managed_cards_corporates!
    }

    get profileBaseCurrency() {
        return (
            (this.isConsumer
                ? this.stores.consumers.consumer?.baseCurrency
                : this.stores.corporates.corporate?.baseCurrency) || null
        )
    }

    get consumer(): ConsumerModel | null {
        return this.stores.consumers.consumer
    }

    get isConsumerPopulated() {
        return this.consumer && this.isConsumer
    }

    get isCorporatePopulated() {
        return this.corporate && this.isCorporate
    }

    get rootName(): string {
        if (this.isConsumerPopulated) {
            return this.stores.consumers.consumer!.rootUser.name
        } else if (this.isCorporatePopulated) {
            return this.stores.corporates.corporate!.rootUser.name
        } else return 'noname'
    }

    get rootSurname(): string {
        if (this.isConsumerPopulated) {
            return this.stores.consumers.consumer!.rootUser.surname
        } else if (this.isCorporatePopulated) {
            return this.stores.corporates.corporate!.rootUser.surname
        } else return 'nosurname'
    }

    get rootFullName(): string {
        return `${this.rootName} ${this.rootSurname}`
    }

    get corporate() {
        return this.stores.corporates.corporate
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
        if (this.stores.auth.isConsumer) {
            return this.stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
        } else {
            return this.stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
        }
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
        return this.stores.auth.logout().then(this.redirectToLogin)
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

    setSCAstorage() {
        localStorage.setItem('stepUp', 'FALSE')
        localStorage.setItem('scaSmsSent', 'FALSE')
    }
}
