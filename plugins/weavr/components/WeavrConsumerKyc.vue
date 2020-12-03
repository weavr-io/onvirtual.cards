<template>
  <div id="consumer-kyc" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ConsumerVerificationFlowContract, ConsumerVerificationFlowOptions } from './api'

@Component
export default class WeavrConsumerKyc extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: ConsumerVerificationFlowOptions

  mounted() {
    const _kyc = this.$OpcUxSecureClient.consumer_kyc()
    _kyc.init({ ...this.options, selector: '#consumer-kyc', reference: this.reference })
  }
}
</script>

<style lang="scss" scoped></style>
