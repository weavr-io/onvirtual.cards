<template>
    <div :class="props.className" :style="props.baseStyle" />
</template>

<script lang="ts" setup>
import type { SecureElementStyle, SecureSpanOptions } from '~/plugins/weavr/components/api'
import { APP_ROOT_ID } from '~/utils/helper'

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
    // we can change root id in nuxt3, make changes in const if needed
    // add const to nuxt config
    _span.value.mount(document.getElementById(APP_ROOT_ID))
    _addListeners()
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

const spanOptions = computed(() => {
    return {
        ...props.options,
        style: props.baseStyle,
    }
})
</script>
