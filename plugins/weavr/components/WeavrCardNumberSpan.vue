<template>
    <div :class="className" :style="baseStyle" />
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, computed, type Ref, ref } from 'vue'
import { useBase } from '~/composables/useBase'

const props = defineProps<{
    token: String
    options: object
    className: String
    baseStyle: object
}>()

const { root } = useBase()
const emit = defineEmits(['onReady', 'onChange'])

const onReady = () => emit('onReady')
const onChange = () => emit('onChange')

const rootAttr: Ref<HTMLElement | null> = ref(null)
const _span: Ref<{ mount: (el: HTMLElement) => void } | null> = ref(null)

const spanOptions = computed(() => {
    return {
        ...props.options,
        style: props.baseStyle,
    }
})

onMounted(() => {
    if (!rootAttr.value) throw new Error('No element found')

    _span.value = root!.$weavrComponents.display.cardNumber(props.token, spanOptions.value)
    _span.value?.mount(rootAttr.value)
    _addListeners()
})

onBeforeUnmount(() => {
    _removeListeners()
    ;(_span.value as unknown as { destroy: () => void }).destroy()
})

const _addListeners = () => {
    const span = _span.value as unknown as { on: (event: string, callback: Function) => void }

    if (!span) return
    onReady && span.on('ready', onReady)
    onChange && span.on('change', onChange)
}

const _removeListeners = () => {
    const span = _span.value as unknown as { off: (event: string, callback: Function) => void }

    if (!span) return
    onReady && span.off('ready', onReady)
    onChange && span.off('change', onChange)
}
</script>
