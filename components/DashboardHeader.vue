<template>
    <b-container>
        <b-row
            align-h="between"
            align-v="end"
            class="px-0 mb-4 border-bottom dashboard-header-height"
        >
            <b-col cols="7">
                <b-nav class="dashboard-header">
                    <b-nav-item active-class="active" to="/managed-cards"> Cards</b-nav-item>
                    <b-nav-item active-class="active" to="/managed-accounts"> Account</b-nav-item>
                </b-nav>
            </b-col>
            <b-col v-if="accounts.unRefs.isManagedAccounts" class="pb-2">
                <b-row v-if="accounts.unRefs.account" align-h="end" align-v="end">
                    <b-col v-if="canAddFunds" class="text-right mr-3 mr-sm-2" cols="2" lg="1">
                        <b-button
                            :to="'/managed-accounts/' + accounts.unRefs.account.id + '/topup'"
                            class="add-funds"
                            variant="secondary"
                        >
                            +
                        </b-button>
                    </b-col>
                    <b-col cols="auto">
                        <div class="account-balance">
                            <p class="mb-0 text-muted font-size-small account-balance-label">
                                balance
                            </p>
                            <p class="mb-0 account-balance-value">
                                {{
                                    accounts.unRefs.account.balances.availableBalance |
                                        weavr_currency(accounts.unRefs.account.currency)
                                }}
                            </p>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col v-if="cards.unRefs.isManagedCards">
                <b-col class="pb-2">
                    <b-row align-h="end" align-v="end">
                        <div v-if="cards.unRefs.hasCards" class="account-balance">
                            <p class="mb-0 text-muted account-balance-label">total balance</p>
                            <p class="mb-0 account-balance-value">
                                {{
                                    cards.unRefs.cardsBalance |
                                        weavr_currency(cards.unRefs.cardCurrency.currency)
                                }}
                            </p>
                        </div>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>
    </b-container>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { useAccounts } from '~/composables/useAccounts'
import { useBase } from '~/composables/useBase'
import { useCards } from '~/composables/useCards'

@Component
export default class DashboardHeader extends Vue {
    base = useBase(this)
    accounts = useAccounts(this)
    cards = useCards(this)

    get canAddFunds(): boolean {
        if (this.base.unRefs.isConsumer) {
            return this.base.stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
        } else if (this.base.unRefs.isCorporate) {
            return this.base.stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
        } else {
            return false
        }
    }
}
</script>

<style lang="scss" scoped>
.account-balance {
    .account-balance-label {
        font-size: 0.8rem;
    }

    .account-balance-value {
        font-size: 1.5rem;
    }
}

.add-funds {
    border-radius: 100%;
    padding: 13px 10px 18px;
    line-height: 0;
    font-size: 20px;
}

.account {
    &-name {
        font-size: 1.2rem;
    }

    &-expiry {
        &-label {
            font-size: 0.8rem;
        }
    }
}

.account-view-details {
    background: #f0edde;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    display: block;
    font-size: 0.6rem;
}
</style>
