<template>
  <section>
    <b-container>
      <b-row :class="{ 'd-none': accessTokenError }">
        <b-col>
          <weavr-kyc-beneficiaries :reference="reference" :options="kybOptions" @message="handleSumSubMessage" />
        </b-col>
      </b-row>
    </b-container>
    <b-container v-if="accessTokenError">
      <b-row align-h="center">
        <b-col md="6">
          <b-alert variant="danger" show>
            <p class="text-center m-0">
              The link that you are trying to use may have expired. Please contact your main account holder to obtain a
              new link.
            </p>
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { KYBOptions } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight,
  },
})
export default class KybPage extends mixins(BaseMixin) {
  reference!: string

  accessTokenError: boolean = false

  get kybOptions(): KYBOptions {
    return {
      customCss: '',
    }
  }

  asyncData({ route }) {
    return { reference: route.query.reference }
  }

  handleSumSubMessage(message) {
    if (message.messageType === 'idCheck.onError') {
      if (message.payload.error === 'Access token required') {
        this.accessTokenError = true
      }
    }
  }
}
</script>
