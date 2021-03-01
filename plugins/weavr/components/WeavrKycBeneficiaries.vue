<template>
  <div id="director-kyc" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { KYCOptions } from './api'

@Component
export default class WeavrKycBeneficiaries extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: KYCOptions

  mounted() {
    this.$weavrComponents.capture
      .beneficiariesKyc(this.reference)
      .mount('#director-kyc', { ...this.options, onMessage: this.sumsubMessage })
  }

  @Emit('message')
  sumsubMessage(messageType, payload) {
    return {
      messageType: messageType,
      payload: payload
    }
  }
}
</script>

<style lang="scss" scoped></style>
