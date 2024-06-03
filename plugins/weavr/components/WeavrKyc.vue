<template>
    <div id="consumer-kyc" />
</template>
<script lang="ts" setup>
import { PropType, getCurrentInstance, onMounted } from '@nuxtjs/composition-api'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

const { proxy: root } = getCurrentInstance() || {}

const props = defineProps({
    reference: {
        type: String,
        required: true,
    },
    options: {
        type: Object as PropType<ConsumerVerificationFlowOptions>,
        required: true,
    },
})

onMounted(() => {
    root?.$weavrComponents.capture
        .consumerKyc(props.reference)
        .mount('#consumer-kyc', props.options)
})
</script>

<style lang="scss" scoped></style>
