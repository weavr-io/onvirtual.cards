<template>
  <div id="idensic" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { KYBOptions } from '~/plugins/weavr/components/api'

@Component
export default class WeavrKyb extends Vue {
  @Prop({}) reference!: string
  @Prop({}) options!: KYBOptions

  mounted() {
    const kyb = this.$OpcUxSecureClient.kyb()

    kyb.init(
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
