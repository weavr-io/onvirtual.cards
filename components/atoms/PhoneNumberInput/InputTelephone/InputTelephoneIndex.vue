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
            class="input-tel__input"
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
            class="input-tel__label"
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
@import '@/components/atoms/PhoneNumberInput/assets/variables.scss';
@import 'style-helpers';

.input-tel {
    position: relative;
    height: 40px;
    min-height: 40px;

    &__label {
        position: absolute;
        top: 4px;
        cursor: text;
        left: 13px;
        transform: translateY(25%);
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        font-size: 11px;
        color: $secondary-color;
    }

    &__input {
        cursor: text;
        background-color: $bg-color;
        transition-duration: 0.3s;
        position: relative;
        width: 100%;
        padding: 0 12px;
        font-weight: 400;
        appearance: none;
        outline: none;
        border: 1px solid $third-color;
        font-size: 14px;
        z-index: 0;
        margin-left: -1px;
        height: 40px;
        min-height: 40px;

        &:hover {
            border-color: $primary-color;
        }

        &::-webkit-input-placeholder {
            color: $secondary-color;
        }

        &::-moz-placeholder {
            color: $secondary-color;
        }

        &:-ms-input-placeholder {
            color: $secondary-color;
        }

        &::-ms-input-placeholder {
            color: $secondary-color;
        }

        &:-moz-placeholder {
            color: $secondary-color;
        }

        &::placeholder {
            color: $secondary-color;
        }

        &__input:-webkit-autofill,
        &__input:-webkit-autofill:hover,
        &__input:-webkit-autofill:focus,
        &__input:-webkit-autofill:active {
            box-shadow: 0 0 0 1000px $bg-color inset !important;
            -webkit-text-fill-color: $secondary-color !important;
        }
    }

    &.is-focused {
        z-index: 1;

        .input-tel {
            &__input {
                border-color: $primary-color;
                box-shadow: 0 0 0 0.125rem $primary-color-transparency;
            }

            &__label {
                color: $primary-color;
            }
        }

        &.has-error {
            .input-tel__input {
                box-shadow: 0 0 0 0.125rem $danger-color-transparency;
            }
        }
    }

    &.has-value {
        .input-tel__label {
            opacity: 1;
            transform: translateY(0);
            font-size: 11px;
        }

        .input-tel__input {
            padding-top: 14px;
        }
    }

    &.has-value,
    &.has-hint {
        .input-tel__label {
            opacity: 1;
            transform: translateY(0);
            font-size: 11px;
        }

        .input-tel__input {
            padding-top: 14px;
        }
    }

    &.has-error:not(.is-valid) {
        .input-tel__input {
            border-color: $danger-color;
        }

        .input-tel__label {
            color: $danger-color;
        }
    }
}
</style>
