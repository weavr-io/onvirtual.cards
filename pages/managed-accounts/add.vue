<template>
    <section>
        <b-container>
            <b-row align-h="center">
                <b-col lg="4" md="9">
                    <b-card v-if="isCorporate" class="border-0">
                        <b-card-title class="mb-5 text-center fw-lighter">
                            Select Account Currency
                        </b-card-title>
                        <b-form @submit.prevent="doAdd">
                            <b-form-row>
                                <b-col>
                                    <b-form-group
                                        :state="validation.getState('currency')"
                                        :valid-feedback="validation.getInvalidFeedback('currency')"
                                        label="Currency"
                                    >
                                        <b-form-select
                                            v-model="createManagedAccountRequest.currency"
                                            :options="currencyOptions"
                                        />
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                            <LoaderButton
                                :is-loading="localIsBusy"
                                class="mt-5 text-center"
                                text="finish"
                            />
                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import { useAccounts } from '~/composables/useAccounts'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { CurrencySelectConst } from '~/plugins/weavr-multi/api/models/common'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import {
    INITIAL_MA_REQUEST,
    ManagedAccountSchema,
    type ManagedAccount,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

definePageMeta({
    middleware: 'ky-verified',
})
const {
    profileBaseCurrency,
    showErrorToast,
    isConsumer,
    accountJurisdictionProfileId,
    isCorporate,
} = useBase()
const { goToManagedAccountIndex } = useAccounts()
const { accounts } = useStores(['accounts'])
const localIsBusy = ref(false)
const createManagedAccountRequest: ManagedAccount = reactive(INITIAL_MA_REQUEST())

const validation = computed(() => {
    return useZodValidation(ManagedAccountSchema, createManagedAccountRequest)
})

const currencyOptions = computed(() => {
    return CurrencySelectConst.filter((item) => {
        return item.value === profileBaseCurrency.value
    })
})

useAsyncData(async () => {
    await accounts
        ?.index({
            profileId: accountJurisdictionProfileId.value,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
        .then(async (res) => {
            if (parseInt(res.data.count!) < 1) {
                if (isConsumer) {
                    await accounts
                        ?.create(createManagedAccountRequest)
                        .then(async (res) => {
                            await accounts.upgradeIban(res.data.id)
                            return goToManagedAccountIndex()
                        })
                        .catch((err) => {
                            const data = err.response.data
                            const error = data.message ? data.message : data.errorCode

                            showErrorToast(error)
                            goToManagedAccountIndex()
                        })
                }
            } else {
                goToManagedAccountIndex()
            }
        })
})

const doAdd = async () => {
    await validation.value.validate()

    if (validation.value.isInvalid.value) return

    localIsBusy.value = true

    await accounts
        ?.create(createManagedAccountRequest)
        .then(async (res) => {
            await accounts.upgradeIban(res.data.id)
            return goToManagedAccountIndex()
        })
        .catch((err) => {
            const data = err.response.data
            const error = data.message ? data.message : data.errorCode

            showErrorToast(error)
        })

    localIsBusy.value = false
}

watch(
    isConsumer,
    () => {
        createManagedAccountRequest.profileId = accountJurisdictionProfileId.value
    },
    { immediate: true },
)
</script>
