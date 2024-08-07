<template>
    <div :class="props.className" class="weavr-input" />
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
import {
    SecureElementStyleWithPseudoClasses,
    SecureInputOptions,
} from '~/plugins/weavr/components/api'

const { proxy: root } = getCurrentInstance() || {}

const props = withDefaults(
    defineProps<{
        name?: string
        placeholder?: string
        value?: string
        options?: SecureInputOptions
        className?: string | string[]
        customStyle?: Object
        baseStyle?: SecureElementStyleWithPseudoClasses
        emptyStyle?: SecureElementStyleWithPseudoClasses
        validStyle?: SecureElementStyleWithPseudoClasses
        invalidStyle?: SecureElementStyleWithPseudoClasses
    }>(),
    {
        name: undefined,
        placeholder: undefined,
        value: undefined,
        options: undefined,
        className: undefined,
        customStyle: undefined,
        baseStyle: undefined,
        emptyStyle: undefined,
        validStyle: undefined,
        invalidStyle: undefined,
    },
)

const emit = defineEmits(['onReady', 'onChange', 'onKeyUp', 'onBlur', 'onFocus', 'onStrength'])

const passwordInput: Ref<any> = ref(null)

const _input = computed({
    get() {
        return passwordInput.value
    },
    set(newValue) {
        passwordInput.value = newValue
    },
})

onMounted(() => {
    _input.value = root?.$weavrComponents.capture.password(props.name, inputOptions.value)
    _input.value?.mount(root?.$el)
    _addListeners(_input.value)
})

const onReady = () => {
    emit('onReady')
}

const onChange = (val) => {
    emit('onChange', val)
}

const onKeyUp = (e) => {
    emit('onKeyUp', e)
}

const onBlur = () => {
    emit('onBlur')
}

const onFocus = () => {
    emit('onFocus')
}

const onStrength = (val) => {
    emit('onStrength', val)
}

const _addListeners = (input) => {
    input.on('ready', onReady)
    input.on('change', onChange)
    input.on('keyup', onKeyUp)
    input.on('blur', onBlur)
    input.on('focus', onFocus)
    input.on('strength', onStrength)
}

const _removeListeners = (input) => {
    input.off('ready', onReady)
    input.off('change', onChange)
    input.off('keyup', onKeyUp)
    input.off('blur', onBlur)
    input.off('focus', onFocus)
    input.off('strength', onStrength)
}

onBeforeUnmount(() => {
    _removeListeners(_input.value)
    _input.value.destroy()
})

const createToken = () => {
    return _input.value.createToken()
}
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

defineExpose({
    createToken,
})
</script>

<style lang="scss" scoped></style>
