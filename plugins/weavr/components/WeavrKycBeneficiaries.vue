<template>
    <div id="director-kyc" />
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, onMounted } from 'vue'
import type { KYCOptions } from './api'
import { useBase } from '~/composables/useBase'

const props = defineProps<{
    reference: String
    options: KYCOptions
}>()

const { root } = useBase()
const emit = defineEmits(['message'])

onMounted(() => {
    root!.$weavrComponents.capture
        .beneficiariesKyc(props.reference)
        .mount('#director-kyc', { ...props.options, onMessage: sumsubMessage })
})

const sumsubMessage = (messageType, payload) => {
    emit('message', { messageType, payload })
}
</script>
