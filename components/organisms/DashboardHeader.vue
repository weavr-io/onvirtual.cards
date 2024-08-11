<template>
    <b-container>
        <b-row
            align-h="between"
            align-v="end"
            class="px-0 mb-4 border-bottom dashboard-header-height"
        >
            <b-col cols="7">
                <b-nav class="dashboard-header">
                    <b-nav-item active-class="active" to="/managed-cards">Cards</b-nav-item>
                    <b-nav-item active-class="active" to="/managed-accounts"> Account</b-nav-item>
                </b-nav>
            </b-col>
            <b-col v-if="isManagedAccounts" class="pb-2">
                <b-row v-if="account" align-h="end" align-v="end">
                    <b-col v-if="canAddFunds" class="text-right me-3 me-sm-2" cols="2" lg="1">
                        <b-button
                            :to="'/managed-accounts/' + account.id + '/topup'"
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
                                {{ accountCurrency }}
                            </p>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col v-if="isManagedCards">
                <b-col class="pb-2">
                    <b-row align-h="end" align-v="end">
                        <div v-if="hasCards" class="account-balance">
                            <p class="mb-0 text-muted account-balance-label text-end">
                                total balance
                            </p>
                            <p v-if="cardCurrency" class="mb-0 account-balance-value text-end">
                                {{ currency }}
                            </p>
                        </div>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>
    </b-container>
</template>
<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useAccounts } from '~/composables/useAccounts'
import { useCards } from '~/composables/useCards'
import { useStores } from '~/composables/useStores'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { weavrCurrency } from '~/utils/helper'

const { isConsumer, isCorporate } = useBase()
const { account, isManagedAccounts } = useAccounts()
const { cardsBalance, cardCurrency, isManagedCards, hasCards } = useCards()
const { consumers, corporates } = useStores(['consumers', 'corporates'])

const canAddFunds: ComputedRef<boolean> = computed(() => {
    if (isConsumer.value) {
        return consumers?.consumerState.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
    } else if (isCorporate.value) {
        return corporates?.corporateState.kyb?.kybStatus === KYBStatusEnum.APPROVED
    }

    return false
})

const accountCurrency = computed(() =>
    weavrCurrency(account?.value?.balances?.availableBalance, account?.value?.currency),
)

const currency = computed(() => weavrCurrency(cardsBalance.value, cardCurrency.value))
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

:deep(.add-funds) {
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
