<template>
    <div :class="className" class="weavr-input" />
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, computed, type Ref, ref } from 'vue'
import { useBase } from '~/composables/useBase'
import type {
    SecureElementStyleWithPseudoClasses,
    SecureInputOptions,
} from '~/plugins/weavr/components/api'

const props = defineProps<{
    name: String
    placeholder: String
    value: String
    options: SecureInputOptions
    className: String
    customStyle: object
    baseStyle: SecureElementStyleWithPseudoClasses
    emptyStyle: SecureElementStyleWithPseudoClasses
    validStyle: SecureElementStyleWithPseudoClasses
    invalidStyle: SecureElementStyleWithPseudoClasses
}>()

const { root } = useBase()
const emit = defineEmits(['onReady', 'onChange', 'onKeyUp', 'onBlur', 'onFocus', 'onStrength'])

const onReady = () => emit('onReady')
const onChange = () => emit('onChange')
const onKeyUp = () => emit('onKeyUp')
const onBlur = () => emit('onBlur')
const onFocus = () => emit('onFocus')
const onStrength = () => emit('onStrength')

const inputOptions = computed(() => {
    return {
        ...props.options,
        style: {
            base: props.baseStyle,
            empty: props.emptyStyle,
            valid: props.validStyle,
            invalid: props.invalidStyle,
        },
    }
})
const rootAttr: Ref<HTMLElement | null> = ref(null)
const _input: Ref<{ mount: (el: HTMLElement) => void } | null> = ref(null)

onMounted(() => {
    if (!rootAttr.value) throw new Error('No element found')

    _input.value = root!.$weavrComponents.display.password(props.name, inputOptions.value)
    _input.value?.mount(rootAttr.value)
    _addListeners()
})

onBeforeUnmount(() => {
    _removeListeners()
    ;(_input.value as unknown as { destroy: () => void }).destroy()
})

const _addListeners = () => {
    const input = _input.value as unknown as { on: (event: string, callback: Function) => void }

    if (!input) return

    onReady && input.on('ready', onReady)
    onChange && input.on('change', onChange)
    onKeyUp && input.on('keyup', onKeyUp)
    onBlur && input.on('blur', onBlur)
    onFocus && input.on('focus', onFocus)
    onStrength && input.on('strength', onStrength)
}

const _removeListeners = () => {
    const input = _input.value as unknown as { off: (event: string, callback: Function) => void }

    if (!input) return
    onReady && input.off('ready', onReady)
    onChange && input.off('change', onChange)
    onKeyUp && input.off('keyup', onKeyUp)
    onBlur && input.off('blur', onBlur)
    onFocus && input.off('focus', onFocus)
    onStrength && input.off('strength', onStrength)
}
</script>
