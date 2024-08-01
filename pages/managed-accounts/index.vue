<template>
    <section>
        <template v-if="!hasAccount && identityVerified && !pendingDataOrError">
            <b-container class="mb-5">
                <b-row align-v="center">
                    <b-col class="text-right">
                        <b-button to="/managed-accounts/add" variant="border-primary">
                            + add new account
                        </b-button>
                    </b-col>
                </b-row>
            </b-container>
            <b-container class="mt-5">
                <b-row>
                    <b-col class="py-5 text-center">
                        <h4 class="font-weight-light">You do not have an account.</h4>
                        <h5 class="font-weight-lighter">
                            Click
                            <b-link to="/managed-accounts/add"> add new account</b-link>
                            to create your first account.
                        </h5>
                    </b-col>
                </b-row>
            </b-container>
        </template>
        <template v-else>
            <LoadingSpinner center show />
        </template>
    </section>
</template>

<script lang="ts" setup>
import { useAccounts } from '~/composables/useAccounts'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: 'ky-verified',
})
const router = useRouter()
const { accounts } = useStores(['accounts'])
const { accountJurisdictionProfileId, showErrorToast, identityVerified, pendingDataOrError } =
    useBase()
const { hasAccount } = useAccounts()

const getAccounts = () => {
    return accounts
        ?.index({
            profileId: accountJurisdictionProfileId.value,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
        .then((res) => {
            if (parseInt(res.data.count!) >= 1 && res.data.accounts) {
                const _accountId = res.data.accounts[0].id
                router.push(`/managed-accounts/${_accountId}`)
            }
        })
        .catch((err) => {
            const data = err.response.data

            const error = data.message ? data.message : data.errorCode

            showErrorToast(error)
        })
}

useAsyncData(async () => {
    await getAccounts()
})
</script>
