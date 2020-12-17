<template>
  <div id="idensic" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { KYCOptions } from './api'

@Component
export default class WeavrKyc extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: KYCOptions

  mounted() {
    this.$OpcUxSecureClient.kyc().init(
      '#idensic',
      {
        reference: this.reference
      },
      this.sumsubMessage.bind(this),
      this.options
    )
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
