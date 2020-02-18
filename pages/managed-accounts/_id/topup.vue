<template>
  <section>
    <b-container>
      <b-row>
        <b-col v-if="!kybApproved" md="6" offset-md="3" class="py-5 font-weight-lighter">
          <p>
            We must verify certain information relating to your company before you can access funds from your account.
            Please send us the following documents in PDF to
            <a href="mailto:kyb@weavr.io">kyb@weavr.io</a>:
          </p>

          <ul>
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association last amendment</li>
            <li>
              Proof of Business Address such as a copy of a bank statement or lease agreement in the name of the
              business
            </li>
            <li>List of Directors: name, date of birth, address, copy of ID document</li>
            <li>
              List of Ultimate Beneficiary Owners (UBOs) holding a stake of 10% or more of the equity: name, date of
              birth, address, nationality
            </li>
            <li>UBO declaration form <a href="/ubo-declaration.docx" target="_blank">(download link)</a></li>
          </ul>

          <p>
            Each document must be signed by your CEO. For 1-3 above, include the wording “Certified true copy of the
            original" above the CEO’s signature.
          </p>
        </b-col>
        <b-col v-if="kybApproved" md="6" offset-md="3">
          <b-row>
            <b-col>
              <h2 class="text-center font-weight-lighter">
                Transfer funds from your bank account to
              </h2>
            </b-col>
          </b-row>
          <b-row class="py-4">
            <b-col>
              <b-alert show variant="warning">
                Please remember to include payment reference.
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table-simple>
                <b-tbody>
                  <b-tr>
                    <b-th>Beneficiary</b-th>
                    <b-td>{{ account.bankAccountDetails.beneficiary }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>IBAN</b-th>
                    <b-td>{{ account.bankAccountDetails.iban }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>BIC</b-th>
                    <b-td>{{ account.bankAccountDetails.bankIdentifierCode }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Bank</b-th>
                    <b-td>{{ account.bankAccountDetails.beneficiaryBank }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Address</b-th>
                    <b-td style="white-space: pre">
                      {{ account.bankAccountDetails.address | weavr_coma_to_newline }}
                    </b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Payment Reference</b-th>
                    <b-td>
                      {{ account.bankAccountDetails.paymentReference }}
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center">
              <b-button :to="'/managed-accounts/' + accountId" variant="primary" class="px-5">
                close
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as AccountsStore from '~/store/modules/Accounts'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import config from '~/config'
import ManagedAccount = ManagedAccountsSchemas.ManagedAccount

const Accounts = namespace(AccountsStore.name)

@Component({
  components: {}
})
export default class AccountTopupPage extends VueWithRouter {
  @Accounts.Getter account!: ManagedAccount | null

  kybApproved!: boolean

  async asyncData({ store, route, app }) {
    const accountId = route.params.id
    let kybApproved = false

    if (config.app.kyb_required === true) {
      await store.dispatch('corporates/checkKYB').then(
        () => {
          kybApproved = true
        },
        () => {
          kybApproved = false
        }
      )
    } else {
      kybApproved = true
    }

    if (kybApproved) {
      await store.dispatch('accounts/get', accountId)
    }

    return { accountId: accountId, kybApproved: kybApproved }
  }

  mounted() {
    super.mounted()
    this.$segment.track('Account Top Up', {})
    this.$appcues().track('Account Top Up', {})
    this.$userpilot().track('Account Top Up', {})
  }
}
</script>
