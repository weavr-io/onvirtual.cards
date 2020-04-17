<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" class="py-5 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
            Please send us the following documents in PDF to
            <a href="mailto:kyb@weavr.io" class="link font-weight-normal">kyb@weavr.io</a>
          </p>
          <p>
            Each document must be signed by your CEO. For 1-3 include the wording “Certified true copy of the original”
            above the CEO’s signature.
          </p>

          <ol class="my-5 font-weight-normal">
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
            <li>
              <a href="/ubo-declaration.docx" target="_blank" class="link">UBO declaration form <b-icon icon="box-arrow-up-right" /></a>
            </li>
          </ol>
          <div class="text-center">
            <b-button to="/">
              ok, take me to dashboard
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class KybPage extends VueWithRouter {}
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
