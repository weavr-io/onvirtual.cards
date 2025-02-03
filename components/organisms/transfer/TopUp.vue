<template>
    <b-form @submit.prevent="submitForm">
        <b-row>
            <b-col>
                <h2 class="text-center font-weight-lighter">
                    <template v-if="!accountDetails"> No account found</template>
                    <template v-else-if="accountBalance < 0.01"> Not enough funds</template>
                    <template v-else> Top up amount</template>
                </h2>
            </b-col>
        </b-row>
        <b-row v-if="!accountDetails" class="py-5 my-5 text-center">
            <b-col>
                <b-row>
                    <b-col>
                        <h4 class="font-weight-light">
                            You do not have an account to transfer funds from.
                        </h4>
                        <h5 class="font-weight-lighter">Start by creating an account.</h5>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button to="/managed-accounts" variant="secondary">
                            go to accounts
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else-if="accountBalance < 0.01" class="py-5 my-5 text-center">
            <b-col>
                <b-row>
                    <b-col>
                        <h4 class="font-weight-light">
                            You do not have enough funds in your account.
                        </h4>
                        <h5 class="font-weight-lighter">Start by topping up.</h5>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button to="/managed-cards" variant="secondary">
                            go to cards
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else class="py-5 my-5">
            <b-col>
                <b-row>
                    <b-col>
                        <b-form-group
                            :invalid-feedback="validation.getInvalidFeedback('amount')"
                            :state="validation.getState('amount')"
                            label="Amount:"
                        >
                            <b-input-group :prepend="accountDetails.currency">
                                <b-form-input
                                    v-model.number="request.amount"
                                    min="0.01"
                                    step="0.01"
                                    type="number"
                                />
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button type="submit" variant="secondary">
                            next
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-form>
</template>
<script lang="ts" setup>
import { computed, PropType, reactive } from '@nuxtjs/composition-api'
import { z } from 'zod'
import { AmountWithMaxSchema } from '~/plugins/weavr-multi/api/models/common'
import { InstrumentID } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'

const props = defineProps({
    selectedAccount: {
        type: Object as PropType<InstrumentID>,
        default: () => {},
    },
})

const emit = defineEmits(['submit-form'])
const { accounts } = useStores(['accounts'])

const request = reactive({
    amount: 0,
})

const _accounts = computed(() => accounts?.accountState.accounts)

const accountDetails = computed(() => {
    if (_accounts.value) {
        return _accounts.value.accounts?.find((account) => {
            return account.id === props.selectedAccount.id
        })
    }

    return undefined
})

const accountBalance = computed(() => {
    const balance = accountDetails.value?.balances.availableBalance
    if (balance) {
        return balance / 100
    }

    return 0
})

const amountSchema = z.object({
    amount: AmountWithMaxSchema(accountBalance.value),
})
const validation = computed(() => useZodValidation(amountSchema, request))

const submitForm = async () => {
    await validation.value.validate()
    if (validation.value.isInvalid.value) return null

    emit('submit-form', request)
}
</script>
