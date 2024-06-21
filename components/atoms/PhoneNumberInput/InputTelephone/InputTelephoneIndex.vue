<template>
    <div
        ref="parent"
        :class="[
            {
                'is-focused': isFocus,
                'has-value': value,
                'has-error': error,
                'has-hint': hint,
            },
        ]"
        class="input-tel"
        @click="focusInput"
        @mouseenter="updateHoverState(true)"
        @mouseleave="updateHoverState(false)"
    >
        <input
            :id="id"
            ref="InputTel"
            v-model="inputValue"
            :placeholder="labelValue"
            :required="true"
            :style="[{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }]"
            :type="type"
            class="input-tel-input"
            v-bind="$attrs"
            @blur="onBlur"
            @click="$emit('click', $event)"
            @focus="onFocus"
            @keydown="keyDown"
        />
        <label
            ref="label"
            :class="error ? 'text-danger' : null"
            :for="id"
            class="input-tel-label"
            @click="focusInput"
        >
            {{ hintValue || labelValue }}
        </label>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        value: string[] | number[] | null
        label: string
        hint: string | null
        error: boolean
        id: string
        type: string
        readonly: boolean
        valid: boolean
        loader: boolean
    }>(),
    {
        value: null,
        label: 'Enter text',
        hint: null,
        error: false,
        id: 'InputTel',
        type: 'tel',
        readonly: false,
        valid: false,
        loader: false,
    },
)

const inputTel = ref<HTMLElement | null>(null)
const emit = defineEmits(['click', 'input', 'focus', 'blur', 'keydown'])

const isFocus = ref(false)
const isHover = ref(false)

const inputValue = computed({
    get: () => props.value,
    set: (value) => emit('input', value),
})

const labelValue = computed(() => {
    return props.label ? `${props.label} *` : props.label
})

const hintValue = computed(() => {
    return props.hint ? `${props.hint} *` : props.hint
})

const updateHoverState = (value: boolean) => {
    isHover.value = value
}

const focusInput = () => {
    if (inputTel.value) {
        inputTel.value.focus()
    }
}

const onFocus = () => {
    emit('focus')
    isFocus.value = true
}

const onBlur = () => {
    emit('blur')
    isFocus.value = false
}

const keyDown = (e: KeyboardEvent) => {
    if (
        !isFinite(Number(e.key)) &&
        e.key !== 'Backspace' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight'
    ) {
        e.preventDefault()
    }
}
</script>

<style lang="scss" scoped>
@import 'style-helpers';
</style>
