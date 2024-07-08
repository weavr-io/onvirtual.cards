<template>
    <div id="director-kyc" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { KYCOptions } from '~/plugins/weavr/components/api'

const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        reference: string
        options: KYCOptions
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
        .beneficiariesKyc(props.reference)
        .mount('#director-kyc', { ...props.options, onMessage: sumsubMessage })
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
