<template>
    <div
        ref="parent"
        :class="[
            {
                'is-focused': isFocus,
                'has-value': value,
                'has-error': error,
                'has-hint': hint,
                'is-disabled': disabled,
            },
        ]"
        class="input-tel"
        @click="focusInput"
        @mouseenter="updateHoverState(true)"
        @mouseleave="updateHoverState(false)"
    >
        <input
            v-bind="$attrs"
            :id="id"
            ref="InputTel"
            v-model="inputValue"
            :disabled="disabled"
            :placeholder="`${label} *`"
            :required="true"
            :style="[{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }]"
            :type="type"
            class="input-tel-input"
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
            {{ hintValue || `${label} *` }}
        </label>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        value?: string
        label: string
        hint: string
        error: boolean
        id: string
        type?: string
        readonly?: boolean
        valid: boolean
        loader?: boolean
        disabled?: boolean
    }>(),
    {
        value: '',
        label: 'Enter text',
        hint: '',
        error: false,
        id: 'InputTel',
        type: 'tel',
        readonly: false,
        valid: false,
        loader: false,
        disabled: false,
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
