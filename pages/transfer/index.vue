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
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { DeepNullable } from '~/global'
import { useBase } from '~/composables/useBase'

@Component({
    components: {
        LoaderButton: () => import('~/components/LoaderButton.vue'),
        AccountSelection: () => import('~/components/transfer/AccountSelection.vue'),
        TopUp: () => import('~/components/transfer/TopUp.vue'),
        TopUpSuccess: () => import('~/components/transfer/TopUpSuccess.vue'),
    },
    middleware: ['kyVerified'],
})
export default class TransfersPage extends Vue {
    base = useBase(this)

    createTransferRequest: DeepNullable<CreateTransferRequest> | null = null
    screen: number = 1
    public accountTypes = [
        {
            value: 'managed_accounts',
            text: 'Managed Accounts',
        },
        {
            value: 'managed_cards',
            text: 'Managed Cards',
        },
    ]

    get cards() {
        return this.base.stores.cards.cards?.cards
    }

    get accounts() {
        return this.base.stores.accounts.accounts
    }

    get formattedCards(): { value: number; text: string }[] {
        return (
            this.cards?.map((val) => {
                return {
                    value: +val.id, // Todo: Check if valid conversion - remove need for conversion
                    text: val.friendlyName,
                }
            }) || []
        )
    }

    async fetch() {
        await this.base.stores.cards.getCards()
        const accounts = await this.base.stores.accounts.index({
            profileId: this.base.unRefs.accountProfileId,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
        const firstAccount = accounts.data.accounts && accounts.data.accounts[0]

        this.createTransferRequest = {
            profileId: this.$config.profileId.transfers!,
            source: {
                type: InstrumentEnum.managedAccounts,
                id: firstAccount?.id || '',
            },
            destination: {
                type: InstrumentEnum.managedCards,
                id: this.$route.query.destination as string,
            },
            destinationAmount: {
                currency: firstAccount?.currency || CurrencyEnum.EUR,
                amount: 0,
            },
        }
    }

    nextScreen() {
        this.screen++
    }

    accountSelected(_data) {
        if (_data != null && this.createTransferRequest) {
            this.createTransferRequest.source!.type = _data.source.type
            this.createTransferRequest.source!.id = _data.source.id
            this.nextScreen()
        }
    }

    topUpSelected(_data) {
        if (_data != null && this.createTransferRequest) {
            this.createTransferRequest.destinationAmount!.amount = _data.amount * 100
            this.doTransfer()
        }
    }

    doTransfer() {
        this.base.stores.transfers
            .execute(this.createTransferRequest as CreateTransferRequest)
            .then(() => {
                this.createTransferRequest = {
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
                }
                this.screen = 2
            })
            .catch((err) => {
                this.screen = 1

                const data = err.response.data

                let error = data.message ? data.message : data.errorCode

                if (error === 'DENIED_BY_INSTRUMENT') {
                    error = 'Amount is higher than available balance'
                }

                this.base.showErrorToast(error)
            })
    }
}
</script>
<style lang="scss" scoped>
label > span {
    width: 100%;
}
</style>
