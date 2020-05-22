<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <weavr-kyc
            :corporate-id="corporateId"
            :access-token="accessToken"
            :options="kybOptions"
            @message="handleSumSubMessage"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { KYBOptions } from '~/plugins/weavr/components/api'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class KybPage extends VueWithRouter {
  accessToken!: string
  corporateId!: string

  get kybOptions(): KYBOptions {
    return {
      customCss: ''
    }
  }

  asyncData({ route }) {
    return { accessToken: route.query.token, corporateId: route.query.corporate }
  }

  handleSumSubMessage(message) {
    console.log(message)
  }
}
</script>
