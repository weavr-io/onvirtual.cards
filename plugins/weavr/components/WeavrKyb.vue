<template>
  <div id="kyb-container" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { KYBOptions } from '~/plugins/weavr/components/api'

@Component
export default class WeavrKyb extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: KYBOptions

  mounted() {
    this.$weavrComponents.verification.kyb(this.reference).mount('#kyb-container', this.options)
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
