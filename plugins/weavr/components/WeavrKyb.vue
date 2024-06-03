<template>
    <div id="kyb-container" />
</template>
<script lang="ts" setup>
import { PropType, getCurrentInstance, onMounted } from '@nuxtjs/composition-api'
import { KYBOptions } from '~/plugins/weavr/components/api'

const { proxy: root } = getCurrentInstance() || {}

const props = defineProps({
    reference: {
        type: String,
        required: true,
    },
    options: {
        type: Object as PropType<KYBOptions>,
        required: true,
    },
})

const emit = defineEmits(['message'])

const message = (value) => {
    emit('message', value)
}

onMounted(() => {
    root?.$weavrComponents.capture
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
