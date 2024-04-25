<template>
    <div>
        <b-card
            id="managed-card"
            :class="[{ 'card-frozen': isBlocked }, { 'card-destroyed': isDestroyed }]"
            class="border-0 cards-card"
            no-body
        >
            <b-card-body class="card-body onvirtual-card overflow-hidden shadow-hover-sm">
                <b-aspect :aspect="'1.6:1'" class="overflow-hidden">
                    <b-overlay :show="localIsBusy" class="overflow-hidden" spinner-small>
                        <b-link :to="statementsLink">
                            <b-container class="p-0" fluid>
                                <b-row>
                                    <b-col
                                        v-if="card.balances?.availableBalance"
                                        class="card-balance text-right"
                                    >
                                        {{
                                            getCurrency(
                                                card.balances.availableBalance,
                                                card.currency,
                                            )
                                        }}
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3 mb-3">
                                    <b-col>
                                        <b-row>
                                            <b-col>
                                                <div class="card-name text-truncate">
                                                    {{ card.friendlyName }}
                                                </div>
                                            </b-col>
                                        </b-row>
                                        <b-row class="mt-2">
                                            <b-col>
                                                <div class="card-number">
                                                    •••• {{ card.cardNumberLastFour }}
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                                <b-row align-v="end">
                                    <b-col cols="6">
                                        <div class="card-name-on-card text-truncate">
                                            {{ card.nameOnCard }}
                                        </div>
                                    </b-col>
                                    <b-col cols="3">
                                        <div class="card-expiry">
                                            <div class="card-expiry-label">EXP</div>
                                            <div v-if="card.expiryMmyy" class="card-expiry-value">
                                                {{ getExpiryDate(card.expiryMmyy) }}
                                            </div>
                                        </div>
                                    </b-col>
                                    <b-col class="text-right" cols="2">
                                        <b-img src="/img/mc_symbol.svg" width="50px" />
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-link>
                    </b-overlay>
                    <b-button
                        v-if="!isDestroyed"
                        class="card-options-button"
                        @click="toggleShowOptions"
                    >
                        <b-icon icon="three-dots-vertical" />
                    </b-button>
                </b-aspect>
            </b-card-body>
        </b-card>
        <transition mode="out-in" name="fade">
            <b-row v-if="showOptions && !isDestroyed">
                <b-col>
                    <div class="p-2 mt-1">
                        <b-link class="py-2 d-block text-decoration-none" @click="toggleBlock">
                            <div class="d-flex align-items-center">
                                <b-img fluid src="/img/freeze-icon.svg" />
                                <div class="ml-3">
                                    <h6 class="m-0 small">
                                        <template v-if="!isBlocked"> Freeze card</template>
                                        <template v-else> Unfreeze card</template>
                                    </h6>
                                    <p v-if="!isBlocked" class="text-muted m-0 small">
                                        Tap again to unfreeze
                                    </p>
                                </div>
                            </div>
                        </b-link>
                        <b-link :to="editLink" class="py-2 mt-md-0 d-block text-decoration-none">
                            <div class="d-flex align-items-center">
                                <b-img fluid src="/img/edit-icon.svg" />
                                <div class="ml-3">
                                    <h6 class="m-0 small">Edit card</h6>
                                    <p class="text-muted m-0 small">
                                        Change name and other details
                                    </p>
                                </div>
                            </div>
                        </b-link>
                    </div>
                </b-col>
            </b-row>
        </transition>
    </div>
</template>
<script lang="ts">
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'
import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { weavrCurrency, expiryMmyy } from '~/utils/helper'
import BaseMixin from '~/mixins/BaseMixin'

@Component({
    components: {
        BIcon,
        BIconThreeDotsVertical,
    },
})
export default class WeavrCard extends mixins(BaseMixin) {
    @Prop() readonly card!: ManagedCardModel

    showOptions = false

    localIsBusy = false

    get isBlocked() {
        return this.card.state.state === ManagedInstrumentStateEnum.BLOCKED
    }

    get isActive() {
        return this.card.state.state === ManagedInstrumentStateEnum.ACTIVE
    }

    get isDestroyed() {
        return this.card.state.state === ManagedInstrumentStateEnum.DESTROYED
    }

    get editLink() {
        if (!this.card) return undefined
        return `/managed-cards/${this.card.id}/edit`
    }

    get statementsLink() {
        if (!this.card) return undefined
        return `/managed-cards/${this.card.id}/statements`
    }

    getCurrency(balance: number, currency: string) {
        return weavrCurrency(balance, currency)
    }

    getExpiryDate(val: string) {
        return expiryMmyy(val)
    }

    async toggleBlock() {
        this.toggleBusy()
        if (this.isBlocked) {
            await this.unblockCard()
        } else {
            await this.blockCard()
        }
        this.toggleBusy()
    }

    async blockCard() {
        await this.cardsStore
            .block(this.card.id)
            .then(this.blocked)
            .catch((err) => {
                const data = err.response.data
                const error = data.message ? data.message : data.errorCode
                this.showErrorToast(error)
            })
    }

    async unblockCard() {
        await this.cardsStore
            .unblock(this.card.id)
            .then(this.unblocked)
            .catch((err) => {
                const data = err.response.data
                const error = data.message ? data.message : data.errorCode
                this.showErrorToast(error)
            })
    }

    toggleShowOptions() {
        this.showOptions = !this.showOptions
    }

    toggleBusy() {
        this.localIsBusy = !this.localIsBusy
    }

    @Emit('blocked')
    blocked() {}

    @Emit('unblocked')
    unblocked() {}
}
</script>
