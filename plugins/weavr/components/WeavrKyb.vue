<template>
  <div id="idensic" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { KYBSumSubOptions } from '~/plugins/weavr/components/api'

@Component
export default class WeavrKyb extends Vue {
  @Prop({}) corporateId!: string
  @Prop({}) accessToken!: string
  @Prop({}) options!: KYBSumSubOptions

  mounted() {
    this.$OpcUxSecureClient.kybSumSub().init(
      '#idensic',
      {
        accessToken: this.accessToken,
        externalUserId: this.corporateId
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
