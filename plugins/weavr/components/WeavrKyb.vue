<template>
    <div id="kyb-container" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useBase } from '~/composables/useBase'
import type { KYBOptions } from '~/plugins/weavr/components/api'

const props = defineProps<{
    reference: String
    options: KYBOptions
}>()

const { root } = useBase()
const emit = defineEmits(['message'])

onMounted(() => {
    root!.$weavrComponents.capture
        .corporateKyb(props.reference)
        .mount('#kyb-container', { ...props.options, onMessage: sumsubMessage })
})

const sumsubMessage = (messageType, payload) => {
    emit('message', { messageType, payload })
}
</script>
