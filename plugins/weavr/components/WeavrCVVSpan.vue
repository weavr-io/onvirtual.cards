<template>
    <div :class="props.className" :style="props.baseStyle" />
</template>
<script lang="ts" setup>
import {
    Ref,
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    ref,
} from '@nuxtjs/composition-api'
import { SecureElementStyle, SecureSpan } from '~/plugins/weavr/components/api'

const { proxy: root } = getCurrentInstance() || {}

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
    _span.value = root?.$weavrComponents.display.cvv(props.token, spanOptions.value)
    _span.value?.mount(root?.$el)
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

<style lang="scss" scoped></style>
