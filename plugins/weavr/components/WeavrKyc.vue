<template>
    <div id="consumer-kyc" />
</template>

<script lang="ts" setup>
import type { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        reference: string
        options: Partial<ConsumerVerificationFlowOptions>
    }>(),
    {
        reference: undefined,
        options: undefined,
    },
)

onMounted(() => {
    $weavrComponents.capture.consumerKyc(props.reference).mount('#consumer-kyc', props.options)
})
</script>
