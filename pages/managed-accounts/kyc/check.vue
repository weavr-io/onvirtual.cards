<template>
    <div>
        <b-container>
            <b-row align-h="center" class="py-5">
                <b-col class="text-center" lg="6" md="9">
                    <b-spinner label="Loading..." />

                    <h2 class="mt-4">Please wait a moment.</h2>
                    <p>We are updating your account status.</p>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    ref,
    useRouter,
    onMounted,
    getCurrentInstance,
} from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'
import { useBase } from '~/composables/useBase'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export default defineComponent({
    middleware: 'kyVerified',
    setup() {
        const { auth, accounts, consumers } = useStores(['auth', 'accounts', 'consumers'])
        const { accountJurisdictionProfileId, sleep } = useBase()
        const { proxy: root } = getCurrentInstance() || {}
        const router = useRouter()

        const tries = ref(0)

        const KycApproved = async () => {
            const _res = await consumers?.getKYC()

            if (
                _res &&
                (_res.data.fullDueDiligence === KYCStatusEnum.APPROVED ||
                    _res.data.fullDueDiligence === KYCStatusEnum.PENDING_REVIEW)
            ) {
                await redirectToAccountPage()
            } else {
                tries.value++
                if (tries.value > 3) {
                    await redirectToAccountPage()
                } else {
                    await sleep(5000)
                    await KycApproved()
                }
            }
        }

        const redirectToAccountPage = async () => {
            const _accounts = await accounts?.index({
                profileId: accountJurisdictionProfileId.value,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })

            if (_accounts && +_accounts.data.count! >= 1 && _accounts.data.accounts) {
                let _accountId = _accounts.data.accounts[0].id
                const pglIdentityId = root!.$config.pglIdentityId
                const pglManagedAccountId = root!.$config.pglManagedAccountId
                if (pglIdentityId && pglManagedAccountId && auth?.identityId === pglIdentityId) {
                    _accountId = pglManagedAccountId
                }
                router.push('/managed-accounts/' + _accountId)
            } else {
                router.push('/managed-accounts')
            }
        }

        onMounted(() => {
            KycApproved()
        })
    },
})
</script>
