<template>
    <section>
        <b-container>
            <b-row align-h="center">
                <b-col v-if="account && !pendingDataOrError" lg="6" md="9">
                    <b-row>
                        <b-col>
                            <h2 class="text-center fw-lighter">
                                Transfer funds from your bank account to
                            </h2>
                        </b-col>
                    </b-row>
                    <b-row v-if="bankAccountDetails" class="pt-4">
                        <b-col>
                            <b-alert show variant="warning">
                                Please remember to include payment reference.
                            </b-alert>
                        </b-col>
                    </b-row>
                    <b-row class="pt-4">
                        <b-col>
                            <b-table-simple>
                                <b-tbody>
                                    <b-tr>
                                        <b-th>Beneficiary</b-th>
                                        <b-td>{{ beneficiaryNameAndSurname }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>IBAN</b-th>
                                        <b-td>{{ iban }}</b-td>
                                    </b-tr>
                                    <b-tr v-if="sepaBic">
                                        <b-th>BIC</b-th>
                                        <b-td>{{ sepaBic }}</b-td>
                                    </b-tr>
                                    <b-tr v-if="swiftCode">
                                        <b-th>Code</b-th>
                                        <b-td>{{ swiftCode }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Bank</b-th>
                                        <b-td>{{ beneficiaryBank }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Address</b-th>
                                        <b-td>
                                            <div>{{ address }}</div>
                                        </b-td>
                                    </b-tr>
                                    <b-tr v-if="paymentReference">
                                        <b-th>Payment Reference</b-th>
                                        <b-td>
                                            {{ paymentReference }}
                                        </b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="text-center my-5">
                            <b-button
                                :to="'/managed-accounts/' + accountId"
                                class="px-5"
                                variant="secondary"
                            >
                                close
                            </b-button>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col v-else>
                    <LoadingSpinner center show />
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import type { BankAccountDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/BankAccountDetailsModel'
import { useStores } from '~/composables/useStores'
import type { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import type { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'
import { useBase } from '~/composables/useBase'
import { useAccounts } from '~/composables/useAccounts'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

definePageMeta({
    middleware: ['ky-verified', 'instruments'],
})
const route = useRoute()
const { pendingDataOrError } = useBase()
const { account, accountId } = useAccounts()
const { accounts } = useStores(['accounts'])

const address = computed(() => {
    return bankAccountDetails.value?.beneficiaryBankAddress?.split(',').join(',<br>')
})

const sepaBic = computed(() => {
    if (!ibanDetails.value?.bankAccountDetails) return ''
    const i = ibanDetails.value?.bankAccountDetails.findIndex((details) => {
        return (details.details as SepaBankDetailsModel).bankIdentifierCode !== undefined
    })

    if (i >= 0) {
        return (
            (ibanDetails.value?.bankAccountDetails[i!] as BankAccountDetailsModel)
                .details as SepaBankDetailsModel
        ).bankIdentifierCode
    } else {
        return ''
    }
})

const swiftCode = computed(() => {
    if (!ibanDetails.value?.bankAccountDetails) return ''
    const i = ibanDetails.value?.bankAccountDetails.findIndex((details) => {
        return (details.details as SwiftBankDetailsModel).code !== undefined
    })

    if (i! >= 0) {
        return (
            (ibanDetails.value?.bankAccountDetails[i!] as BankAccountDetailsModel)
                .details as SwiftBankDetailsModel
        ).code
    } else {
        return false
    }
})

const bankAccountDetails: ComputedRef<BankAccountDetailsModel | undefined> = computed(() => {
    try {
        return ibanDetails.value?.bankAccountDetails[0]
    } catch (e) {
        return undefined
    }
})

const ibanDetails = computed(() => {
    return accounts?.accountState.ibanDetails
})

const beneficiaryNameAndSurname = computed(() => {
    return bankAccountDetails.value?.beneficiaryNameAndSurname
})

const beneficiaryBank = computed(() => {
    return bankAccountDetails.value?.beneficiaryBank
})

const iban = computed(() => {
    return (
        (bankAccountDetails.value?.details &&
            'iban' in bankAccountDetails.value.details &&
            bankAccountDetails.value.details.iban) ||
        ''
    )
})

const paymentReference = computed(() => {
    return bankAccountDetails.value?.paymentReference
})

useAsyncData(async () => {
    await accounts?.getIBANDetails(route.params.id as string)
})
</script>
<style lang="scss" scoped>
ol {
    margin: 0;
    padding: 0;
    list-style-position: inside;

    li {
        margin: 0;
        padding: 16px 0;
        border-top: 1px solid #eaedf6;

        &:last-child {
            border-bottom: 1px solid #eaedf6;
        }
    }
}
</style>
