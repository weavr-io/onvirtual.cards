<template>
    <b-container class="py-5">
        <b-row align-h="center">
            <b-col lg="6" md="9">
                <div class="topup-screens">
                    <div v-if="screen === 0" class="topup-screen">
                        <account-selection @submit-form="accountSelected" />
                    </div>
                    <div v-if="screen === 1" class="topup-screen">
                        <top-up
                            v-if="createTransferRequest"
                            :selected-account="createTransferRequest.source"
                            @submit-form="topUpSelected"
                        />
                    </div>
                    <div v-if="screen === 2" class="topup-screen">
                        <top-up-success />
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>
<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { CurrencyEnum, InstrumentEnum } from '~/plugins/weavr-multi/api/models/common'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import type { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import AccountSelection from '~/components/organisms/transfer/AccountSelection.vue'
import TopUp from '~/components/organisms/transfer/TopUp.vue'
import TopUpSuccess from '~/components/molecules/transfer/TopUpSuccess.vue'

definePageMeta({
    middleware: 'ky-verified',
})

const route = useRoute()
const { accountJurisdictionProfileId, showErrorToast } = useBase()
const { cards, accounts: accountsStore, transfers } = useStores(['accounts', 'cards', 'transfers'])

const createTransferRequest = ref<CreateTransferRequest | null>(null)
const screen = ref(1)

useAsyncData(async () => {
    await cards?.getCards()
    const accounts = await accountsStore?.index({
        profileId: accountJurisdictionProfileId.value,
        state: ManagedInstrumentStateEnum.ACTIVE,
        offset: '0',
    })
    const firstAccount = accounts?.data.accounts && accounts.data.accounts[0]

    createTransferRequest.value = {
        profileId: useRuntimeConfig().public.profileId.transfers!,
        source: {
            type: InstrumentEnum.managedAccounts,
            id: firstAccount?.id || '',
        },
        destination: {
            type: InstrumentEnum.managedCards,
            id: route.query.destination as string,
        },
        destinationAmount: {
            currency: firstAccount?.currency || CurrencyEnum.EUR,
            amount: 0,
        },
    }
})

const nextScreen = () => {
    screen.value++
}

const accountSelected = (_data) => {
    if (_data != null && createTransferRequest) {
        createTransferRequest.value!.source!.type = _data.source.type
        createTransferRequest.value!.source!.id = _data.source.id
        nextScreen()
    }
}

const topUpSelected = (_data) => {
    if (_data != null && createTransferRequest) {
        createTransferRequest.value!.destinationAmount!.amount = _data.amount * 100
        doTransfer()
    }
}

const doTransfer = () => {
    transfers
        ?.execute(createTransferRequest.value as CreateTransferRequest)
        .then(() => {
            createTransferRequest.value = {
                profileId: null,
                source: {
                    type: InstrumentEnum.managedAccounts,
                    id: null,
                },
                destination: {
                    type: InstrumentEnum.managedCards,
                    id: null,
                },
                destinationAmount: {
                    currency: 'EUR',
                    amount: 0,
                },
            } as unknown as CreateTransferRequest
            screen.value = 2
        })
        .catch((err) => {
            screen.value = 1

            const data = err.response.data

            let error = data.message ? data.message : data.errorCode

            if (error === 'DENIED_BY_INSTRUMENT') {
                error = 'Amount is higher than available balance'
            }

            showErrorToast(error)
        })
}
</script>
<style lang="scss" scoped>
label > span {
    width: 100%;
}
</style>
