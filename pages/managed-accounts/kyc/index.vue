<template>
    <section>
        <dashboard-header />
        <b-container>
            <b-row>
                <b-col>
                    <template v-if="pendingDataOrError">
                        <LoadingSpinner center show />
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
import {
    computed,
    defineComponent,
    Ref,
    ref,
    useContext,
    useFetch,
    useRouter,
} from '@nuxtjs/composition-api'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import KYCAlert from '~/components/molecules/consumers/KYCAlert.vue'
import DashboardHeader from '~/components/organisms/DashboardHeader.vue'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { KYCErrorCodeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCErrorCodeEnum'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'

export default defineComponent({
    components: {
        LoadingSpinner,
        DashboardHeader,
        KYCAlert,
        WeavrKyc,
    },
    middleware: 'kyVerified',
    setup() {
        const router = useRouter()
        const { $weavrSetUserToken } = useContext()
        const { pendingDataOrError } = useBase()
        const { auth, consumers } = useStores(['auth', 'consumers'])

        const reference = ref('')
        const kycErrorCode: Ref<KYCErrorCodeEnum | null> = ref(null)

        const isKycPending = computed(() => {
            return kycErrorCode.value === KYCErrorCodeEnum.KYC_PENDING_REVIEW
        })

        const isKycRejected = computed(() => {
            return kycErrorCode.value === KYCErrorCodeEnum.KYC_REJECTED
        })

        const onMessage = (message) => {
            if (message === 'kycSubmitted') {
                router.push('/managed-accounts/kyc/check')
            }
        }

        const options: Ref<Pick<ConsumerVerificationFlowOptions, 'onMessage'>> = ref({
            onMessage,
        })

        useFetch(async () => {
            await consumers
                ?.startKYC()
                .then((res) => {
                    $weavrSetUserToken(`Bearer ${auth?.token}`)
                    reference.value = res.data.reference
                })
                .catch((res) => {
                    kycErrorCode.value = res.response.data.errorCode
                })
        })

        return { pendingDataOrError, isKycPending, isKycRejected, kycErrorCode, options, reference }
    },
})
</script>
