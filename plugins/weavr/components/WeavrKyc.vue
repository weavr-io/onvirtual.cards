<template>
    <div id="consumer-kyc" />
</template>
<script lang="ts" setup>
import { defineProps, onMounted } from 'vue'
import type { ConsumerVerificationFlowOptions } from './api'
import { useBase } from '~/composables/useBase'

const props = defineProps<{
    reference: String
    options: ConsumerVerificationFlowOptions
}>()

const { root } = useBase()

onMounted(() => {
    root!.$weavrComponents.capture
        .consumerKyc(props.reference)
        .mount('#consumer-kyc', props.options)
})
</script>
