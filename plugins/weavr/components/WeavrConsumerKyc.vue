<template>
  <div id="consumer-kyc"/>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'nuxt-property-decorator'
import {ConsumerVerificationFlowContract, ConsumerVerificationFlowOptions} from './api'

@Component
export default class WeavrConsumerKyc extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: ConsumerVerificationFlowOptions

  mounted() {
    this.$weavrComponents.verification.kyc(this.reference).mount('#consumer-kyc', this.options)
  }
}
</script>

<style lang="scss" scoped></style>
