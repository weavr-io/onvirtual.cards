<template>
    <div id="consumer-kyc" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        reference: string
        options: ConsumerVerificationFlowOptions
    }>(),
    {
        reference: undefined,
        options: undefined,
    },
)

onMounted(() => {
    // @ts-ignore
    $weavrComponents.capture.consumerKyc(props.reference).mount('#consumer-kyc', props.options)
})
</script>

<style lang="scss" scoped></style>
