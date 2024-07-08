<template>
    <div id="kyb-container" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { KYBOptions } from '~/plugins/weavr/components/api'

const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        reference: string
        options: KYBOptions
    }>(),
    {
        reference: undefined,
        options: undefined,
    },
)

const emit = defineEmits(['message'])

const message = (value) => {
    emit('message', value)
}

onMounted(() => {
    // @ts-ignore
    $weavrComponents.capture
        .corporateKyb(props.reference)
        .mount('#kyb-container', { ...props.options, onMessage: sumsubMessage })
})

const sumsubMessage = (messageType, payload) => {
    message({ messageType, payload })
    return { messageType, payload }
}

defineExpose({
    sumsubMessage,
})
</script>

<style lang="scss" scoped></style>
