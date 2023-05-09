<template>
    <div id="consumer-kyc" />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ConsumerVerificationFlowOptions } from './api'

@Component
export default class WeavrKyc extends Vue {
    @Prop({}) reference!: string
    @Prop({}) options!: ConsumerVerificationFlowOptions

    mounted() {
        this.$weavrComponents.capture
            .consumerKyc(this.reference)
            .mount('#consumer-kyc', this.options)
    }
}
</script>

<style lang="scss" scoped></style>
