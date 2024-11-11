<template>
    <div ref="captureContainer" :class="props.className" :style="styleValue" />
</template>

<script lang="ts" setup>
import type { StyleValue } from 'vue'
import type { SecureElementStyle, SecureSpanOptions } from '~/plugins/weavr/components/api'

const captureContainer = ref<HTMLDivElement | null>(null)
const { $weavrComponents } = useNuxtApp()

const props = withDefaults(
    defineProps<{
        token: string
        options?: SecureSpanOptions
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

const spanOptions = computed(() => {
    return {
        ...props.options,
        style: props.baseStyle,
    }
})

const onReady = () => {
    emit('onReady')
}

const onChange = (val) => {
    emit('onChange', val)
}

onMounted(() => {
    if (captureContainer.value) {
        _span.value = ($weavrComponents as any).display.cardNumber(props.token, spanOptions.value)
        _span.value.mount(captureContainer.value)
        _addListeners()
    }
})

onBeforeUnmount(() => {
    _removeListeners()
    _span.value.destroy()
})

const _addListeners = () => {
    _span.value.on('ready', onReady)
    _span.value.on('change', onChange)
}

const _removeListeners = () => {
    _span.value.off('ready', onReady)
    _span.value.off('change', onChange)
}
</script>
