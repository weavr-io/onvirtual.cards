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
<script lang="ts">
import { defineComponent, ref, useContext, useFetch, useRoute } from '@nuxtjs/composition-api'
import AccountSelection from '~/components/organisms/transfer/AccountSelection.vue'
import TopUp from '~/components/organisms/transfer/TopUp.vue'
import TopUpSuccess from '~/components/molecules/transfer/TopUpSuccess.vue'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { CurrencyEnum, InstrumentEnum } from '~/plugins/weavr-multi/api/models/common'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'

export default defineComponent({
    components: {
        AccountSelection,
        TopUp,
        TopUpSuccess,
    },
    middleware: 'kyVerified',
    setup() {
        const route = useRoute()
        const { $config } = useContext()
        const { accountJurisdictionProfileId, showErrorToast } = useBase()
        const {
            auth,
            cards,
            accounts: accountsStore,
            transfers,
        } = useStores(['auth', 'accounts', 'cards', 'transfers'])

        const createTransferRequest = ref<CreateTransferRequest | null>(null)
        const screen = ref(1)

        useFetch(async () => {
            await cards?.getCards()
            const accounts = await accountsStore?.index({
                profileId: accountJurisdictionProfileId.value,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })
            let firstAccount = accounts?.data.accounts && accounts.data.accounts[0]
            const pglIdentityId = $config.pglIdentityId
            const pglManagedAccountId = $config.pglManagedAccountId
            if (pglIdentityId && pglManagedAccountId && auth?.identityId === pglIdentityId) {
                const match = accounts?.data.accounts?.find((acc) => acc.id === pglManagedAccountId)
                if (match) {
                    firstAccount = match
                }
            }

            createTransferRequest.value = {
                profileId: $config.profileId.transfers!,
                source: {
                    type: InstrumentEnum.managedAccounts,
                    id: firstAccount?.id || '',
                },
                destination: {
                    type: InstrumentEnum.managedCards,
                    id: route.value.query.destination as string,
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

        return {
            screen,
            accountSelected,
            createTransferRequest,
            topUpSelected,
        }
    },
})
</script>
<style lang="scss" scoped>
label > span {
    width: 100%;
}
</style>
