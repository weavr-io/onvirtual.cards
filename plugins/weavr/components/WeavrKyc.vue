<template>
    <div id="consumer-kyc" />
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted } from '@nuxtjs/composition-api'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

const { proxy: root } = getCurrentInstance() || {}

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
    root?.$weavrComponents.capture
        .consumerKyc(props.reference)
        .mount('#consumer-kyc', props.options)
})
</script>

<style lang="scss" scoped></style>
