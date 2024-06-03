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

const { proxy: root } = getCurrentInstance() || {}

const props = defineProps({
    token: {
        type: String,
        required: true,
    },
    options: {
        type: Object,
        required: true,
    },
    className: {
        type: String,
        required: true,
    },
    baseStyle: {
        type: Object,
        required: true,
    },
})

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
    _span.value = root?.$weavrComponents.display.cardNumber(props.token, spanOptions)
    _span.value.mount(root?.$el)
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

<style lang="scss" scoped></style>
