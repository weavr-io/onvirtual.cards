<template>
  <div id="idensic" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class WeavrKyb extends Vue {
  @Prop({}) corporateId!: string
  @Prop({}) accessToken!: string

  mounted() {
    this.$OpcUxSecureClient.kybSumSub().init(
      '#idensic',
      {
        accessToken: this.accessToken,
        externalUserId: this.corporateId
      },
      function(messageType, payload) {
        // e.g. just logging the incoming messages
        console.log('[IDENSIC DEMO] Idensic message:', messageType, payload)
      },
      {
        customCss:
          'ul { column-count: 1; } h4 {text-align: left; font: Light 30px/44px Be Vietnam;letter-spacing: -0.3px;color: #232A47 !important; opacity: 1;}'
      }
    )
  }
}
</script>

<style lang="scss" scoped></style>
