<template>
  <section>
    <b-container>
      <b-row v-if="!sumsSubEnabled">
        <b-col md="6" offset-md="3" class="py-5 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">We need some documents</h3>
          <p>
            We are required by financial services regulations to perform due diligence on your company before allowing
            you to transact with your account.
          </p>
          <p>Kindly prepare to submit and upload the following documents:</p>
          <ul class="my-3 font-weight-normal">
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association (last amendment)</li>
            <li>Proof of Business Address (e.g. lease agreement)</li>
            <li>
              UBO Declaration Form downloadable from
              <a href="https://storage.cloud.google.com/weavr-cdn/UBO-a.pdf">here.</a>
            </li>
            <li>Commercial registry extract showing shareholders and directors</li>
          </ul>
          <p>You will also need to provide the following information:</p>
          <ul class="my-3 font-weight-normal">
            <li>Directors: name, date of birth, nationality, email address, contact number</li>
            <li>Ultimate Beneficial Owners (UBOs) holding a stake of 25% or more: name, date of birth, nationality</li>
          </ul>
          <div class="text-center">
            <b-button to="/managed-accounts/kyb"> start the verification process </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <template v-if="$fetchState.pending">
            <div class="d-flex justify-content-center">
              <div class="loader-spinner">
                <b-spinner />
              </div>
            </div>
          </template>
          <template v-else-if="!kybErrorCode">
            <weavr-kyb :reference="reference" :options="kybOptions" @message="handleSumSubMessage" />
          </template>
          <template v-else>
            <template v-if="isKybApproved">
              <h3>Necessary due diligence approved</h3>
              <p>The necessary due diligence has already been approved</p>
              <div class="text-center">
                <b-button to="/managed-accounts"> back to accounts </b-button>
              </div>
            </template>
            <template v-else-if="isKybPending">
              <h3>Due diligence pending</h3>
              <p>The submitted company documents and information are pending approval.</p>
              <div class="text-center pt-5">
                <b-button to="/"> back to dashboard </b-button>
              </div>
            </template>
            <template v-else>
              <h3>Issues with your due diligence</h3>
              <p v-if="isKybRejected">The submitted company documents and information were rejected.</p>
              <small class="text-muted">{{ kybErrorCode }}</small>
            </template>
          </template>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import BaseMixin from '~/mixins/BaseMixin'
import { KYBErrorCodeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBErrorCodeEnum'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight,
  },
  middleware: ['kyVerified'],
})
export default class KybPage extends mixins(BaseMixin) {
  reference: string = ''
  kybErrorCode: KYBErrorCodeEnum | null = null

  get kybOptions() {
    return {
      customCssStr:
        "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam:wght@300;400;500&display=swap');\n\np{ color: #25262B; font-family: 'Be Vietnam', sans-serif;} ul{ column-count: 1; color: #25262B; font-family: 'Be Vietnam', sans-serif; } ul li{ color: #25262B; margin-bottom: 5px; } h4 p, h2, h3.subtitle p{ font-size: 15px; font-weight: 300; margin: 30px 0;} .input-field span, .radio-group span{ text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Be Vietnam', sans-serif; font-weight:500; color: #25262B; } input, select, textarea{ font-family: 'Be Vietnam', sans-serif; height:30px; border-width: 1px; font-size:18px; font-weight: 400; color: #232A47; } input:focus, select:focus, textarea:focus{ border-bottom-color: #D621B2; } input-field{ position:relative;} .input-field span, .radio-group span{ position:absolute; top: 0; height: 20px; } .fields-list.fields-list-two-columns .input-field{ padding-top: 24px; min-height: 40px;} .list li[data-v-044267ea]{ font-family: 'Be Vietnam', sans-serif; color: #25262B; } .flag{ margin-right: 5px;} .upload-item h4{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .sub-steps .sub-step.active{ color: #3CF7CA; } .sub-steps .sub-step{ width: 12px; height: 12px; } button.submit, button[type=submit]{ background: #3CF7CA; text-transform: lowercase; color: #6C1C5C; font-family: 'Be Vietnam', sans-serif; font-weight: 400; font-size: 15px; letter-spacing: 0;} .mobile-button h3{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; font-weight: 500; } .upload-item p{ font-size: 12px; } .mobile-button .fa-icon{ color: #6C1C5C; } .mobile-button h4{ color: #6D7490; font-family: 'Be Vietnam', sans-serif;} button.submit:active:not(:disabled), button.submit:hover:not(:disabled):not(.disabled):not(:active), button[type=submit]:active:not(:disabled), button[type=submit]:hover:not(:disabled):not(.disabled):not(:active){ background: #3CF7CA;} button.submit .arrow, button[type=submit] .arrow{ height: 28px; } .checkbox, .radio-item{ font-family: 'Be Vietnam', sans-serif; color: #232A47; } h4{ font-family: 'Be Vietnam', sans-serif; color: #25262B;} a.payment-method-add{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } a.payment-method-add:hover{ text-decoration: none; } a.payment-method-add .icon{ background: #3CF7CA; width: 38px; height: 38px; } h4.subtitle p{ font-size: 15px; font-weight: 400; color: #6D7490; } h2.uppercase p{ font-weight: 500; } .beneficial-buttons a{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .error-message .message-content, .error-message .message-title{ font-family: 'Be Vietnam', sans-serif; } .error-message .message-title{ letter-spacing: 0.05em; } .payment-method-data h2{ font-family: 'Be Vietnam', sans-serif; color: #232A47; font-size: 15px; font-weight: 400; } .sub-steps .sub-step.pending{ background: #6C1C5C; }",
      onMessage: this.handleSumSubMessage,
    }
  }

  get sumsSubEnabled() {
    return this.$config.app.sumsub_enabled
  }

  async fetch() {
    if (this.sumsSubEnabled) {
      try {
        await this.stores.corporates
          .startKYB()
          .then((res) => {
            this.reference = res.data.reference
            this.$weavrSetUserToken('Bearer ' + this.stores.auth.token)
          })
          .catch((res) => {
            if (res.response.data.errorCode) this.kybErrorCode = res.response.data.errorCode
          })
      } catch (e) {
        this.showErrorToast(e)
      }
    }
  }

  get isKybPending() {
    return this.kybErrorCode === KYBErrorCodeEnum.KYB_PENDING_REVIEW
  }

  get isKybApproved() {
    return this.kybErrorCode === KYBErrorCodeEnum.KYB_ALREADY_APPROVED
  }

  get isKybRejected() {
    return this.kybErrorCode === KYBErrorCodeEnum.KYB_PERMANENTLY_REJECTED
  }

  handleSumSubMessage(message) {}
}
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
