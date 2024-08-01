<template>
    <div ref="captureContainer" :class="props.className" :style="styleValue" />
</template>

<script lang="ts" setup>
import type { StyleValue } from 'vue'
import type { SecureElementStyle, SecureSpan } from '~/plugins/weavr/components/api'

const captureContainer = ref<HTMLDivElement | null>(null)
const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        token: string
        options?: SecureSpan
        className?: string
        baseStyle?: SecureElementStyle
    }>(),
    {
        token: undefined,
        options: undefined,
        className: undefined,
        baseStyle: undefined,
    },
)

const emit = defineEmits(['onReady', 'onChange'])

const span: Ref<any> = ref(null)

const styleValue = computed(() => props.baseStyle as StyleValue)

const _span = computed({
    get() {
        return span.value
    },
    set(newValue) {
        span.value = newValue
    },
})

const onReady = () => {
    emit('onReady')
}

const onChange = (val) => {
    emit('onChange', val)
}

onMounted(() => {
    _span.value = $weavrComponents.display.cardNumber(props.token, spanOptions.value)
    _span.value?.mount(captureContainer.value)
    _addListeners(_span.value)
})

onBeforeUnmount(() => {
    _removeListeners(_span.value)
    _span.value?.destroy()
})

const _addListeners = (input) => {
    input.on('ready', onReady)
    input.on('change', onChange)
}

const _removeListeners = (input) => {
    input.off('ready', onReady)
    input.off('change', onChange)
}

const spanOptions = computed(() => {
    return {
        ...props.options,
        style: props.baseStyle,
    }
})
</script>
