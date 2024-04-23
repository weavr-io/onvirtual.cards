<template>
    <section>
        <dashboard-header />
        <b-container>
            <b-row>
                <b-col>
                    <template v-if="pendingDataOrError">
                        <div class="d-flex justify-content-center">
                            <div class="loader-spinner">
                                <b-spinner />
                            </div>
                        </div>
                    </template>
                    <template v-else-if="isKycPending">
                        <div class="pt-5">
                            <KYCAlert />
                        </div>
                    </template>
                    <template v-else-if="isKycRejected">
                        <h3>Issues with your due diligence</h3>
                        <p>The submitted documents and information were rejected.</p>
                        <small class="text-muted">{{ kycErrorCode }}</small>
                    </template>
                    <template v-else>
                        <weavr-kyc :options="options" :reference="reference" />
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'
import KYCAlert from '~/components/consumers/KYCAlert.vue'
import DashboardHeader from '~/components/DashboardHeader.vue'
import { KYCErrorCodeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCErrorCodeEnum'

@Component({
    components: {
        DashboardHeader,
        KYCAlert,
        WeavrKyc,
    },
    middleware: ['kyVerified'],
})
export default class KycPage extends mixins(BaseMixin) {
    redirectUrl!: string

    reference!: string

    kycErrorCode?: KYCErrorCodeEnum | null = null
    options: Partial<ConsumerVerificationFlowOptions> = {
        onMessage: this.onMessage,
    }

    get isKycPending() {
        return this.kycErrorCode === KYCErrorCodeEnum.KYC_PENDING_REVIEW
    }

    get isKycRejected() {
        return this.kycErrorCode === KYCErrorCodeEnum.KYC_REJECTED
    }

    async fetch() {
        await this.consumersStore
            .startKYC()
            .then((res) => {
                this.$weavrSetUserToken(`Bearer ${this.authStore.token}`)
                this.reference = res.data.reference
            })
            .catch((res) => {
                this.kycErrorCode = res.response.data.errorCode
            })
    }

    onMessage(message) {
        if (message === 'kycSubmitted') {
            this.$router.push('/managed-accounts/kyc/check')
        }
    }
}
</script>
