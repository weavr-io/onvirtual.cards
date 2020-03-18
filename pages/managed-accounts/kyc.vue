<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <iframe id="iframe" :src="redirectUrl" style="width:100%; height:800px;" allow="camera *;" frameborder="0" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'

@Component({
  components: {}
})
export default class KycPage extends VueWithRouter {
  redirectUrl!: string

  async asyncData({ store }) {
    const _consumerId = AuthStore.Helpers.identityId(store)

    const _res = await ConsumersStore.Helpers.startKYC(store, _consumerId)

    return { redirectUrl: _res.data.redirectUrl }
  }

  mounted() {
    super.mounted()

    window.addEventListener('message', receiveMessage, false)
    function receiveMessage(event) {
      console.log(event)
    }
  }
}
</script>
