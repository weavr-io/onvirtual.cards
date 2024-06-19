<template>
    <div
        ref="parent"
        :class="[
            {
                'is-focused': isFocus,
                'has-value': value,
                'has-hint': hint,
                'has-error': error,
                'is-disabled': disabled,
                'is-dark': dark,
                'no-flags': noFlags,
                'has-list-open': hasListOpen,
                'is-valid': valid,
            },
            size,
        ]"
        class="country-selector"
        @blur.capture="handleBlur"
        @mouseenter="updateHoverState(true)"
        @mouseleave="updateHoverState(false)"
    >
        <div
            v-if="value && !noFlags"
            class="country-selector__country-flag"
            @click.stop="toggleList"
        >
            <div :class="`iti-flag-small iti-flag ${value.toLowerCase()}`" />
        </div>
        <input
            :id="id"
            ref="CountrySelector"
            :value="callingCode"
            :placeholder="label"
            :disabled="disabled"
            class="country-selector__input"
            readonly
            @focus="isFocus = true"
            @keydown="keyboardNav"
            @click.stop="toggleList"
        />
        <div class="country-selector__toggle" @click.stop="toggleList">
            <slot name="arrow">
                <svg
                    mlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="country-selector__toggle__arrow"
                >
                    <path
                        class="arrow"
                        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                    />
                    <path fill="none" d="M0 0h24v24H0V0z" />
                </svg>
            </slot>
        </div>
        <label ref="label" class="country-selector__label" @click.stop="toggleList">
            {{ hint || label }}
        </label>
        <Transition name="slide">
            <div
                v-show="hasListOpen"
                ref="countriesList"
                class="country-selector__list"
                :class="{ 'has-calling-code': showCodeOnList }"
                :style="[{ borderRadius: '4px' }, listHeight]"
            >
                <RecycleScroller
                    v-slot="{ item }"
                    :items="countriesSorted"
                    :item-size="1"
                    key-field="iso2"
                >
                    <button
                        :key="`item-${item.code}`"
                        :class="[
                            { selected: value === item.iso2 },
                            { 'keyboard-selected': value !== item.iso2 && tmpValue === item.iso2 },
                        ]"
                        class="flex align-center country-selector__list__item"
                        :style="[
                            { height: '33px' },
                            value === item.iso2 ? { backgroundColor: '#21222E' } : {},
                        ]"
                        tabindex="-1"
                        type="button"
                        @click.stop="updateValue(item.iso2)"
                    >
                        <div v-if="!noFlags" class="country-selector__list__item__flag-container">
                            <div :class="`iti-flag-small iti-flag ${item.iso2.toLowerCase()}`" />
                        </div>
                        <span
                            v-if="showCodeOnList"
                            class="country-selector__list__item__calling-code flex-fixed"
                            >+{{ item.dialCode }}</span
                        >
                        <div class="dots-text">
                            {{ item.name }}
                        </div>
                    </button>
                </RecycleScroller>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, watch } from 'vue'
import { getCountryCallingCode } from 'libphonenumber-js'
import { RecycleScroller } from 'vue-virtual-scroller'
import { nextTick } from '@nuxtjs/composition-api'

const emit = defineEmits(['input', 'open', 'close'])

const props = defineProps({
    id: { type: String, default: 'CountrySelector' },
    value: { type: [String, Object], default: null },
    label: { type: String, default: 'Choose country' },
    hint: { type: String, default: '' },
    size: { type: String, default: '' },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    valid: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    items: { type: Array, default: () => [], required: true },
    preferredCountries: { type: Array, default: () => null },
    onlyCountries: { type: Array, default: () => null },
    ignoredCountries: { type: Array, default: () => null },
    noFlags: { type: Boolean, default: false },
    countriesHeight: { type: Number, default: 35 },
    showCodeOnList: { type: Boolean, default: false },
})

const isFocus = ref(false)
const hasListOpen = ref(false)
const tmpValue = ref(props.value)
const query = ref('')
const isHover = ref(false)
const countriesListRef = ref<HTMLElement | null>(null)
const CountrySelectorRef = ref<HTMLElement | null>(null)
let queryTimer: number | undefined
computed(() => {
    return { height: `${props.countriesHeight}px` }
})
const listHeight = computed(() => {
    return {
        height: `${(props.countriesHeight + 1) * 7}px`,
        maxHeight: `${(props.countriesHeight + 1) * 7}px`,
    }
})

const countriesList = computed(() => {
    return props.items.filter((item: any) => !props.ignoredCountries?.includes(item.iso2))
})

const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries
        ? countries.map((country: any) =>
              countriesList.value.find((item: any) => item.iso2.includes(country)),
          )
        : []
})

const otherCountries = computed(() => {
    return countriesList.value.filter((item: any) => !props.preferredCountries?.includes(item.iso2))
})

const countriesSorted = computed(() => {
    return props.preferredCountries
        ? [...countriesFiltered.value, ...otherCountries.value]
        : props.onlyCountries
          ? countriesFiltered.value
          : countriesList.value
})

const selectedValueIndex = computed(() => {
    return props.value ? countriesSorted.value.findIndex((c: any) => c.iso2 === props.value) : null
})

const tmpValueIndex = computed(() => {
    return countriesSorted.value.findIndex((c: any) => c.iso2 === tmpValue.value)
})

const callingCode = computed(() => {
    return props.value ? `+${getCountryCallingCode(props.value)}` : null
})

const updateHoverState = (value: boolean) => {
    isHover.value = value
}

const handleBlur = (e: FocusEvent) => {
    if (countriesListRef.value?.contains(e.relatedTarget as Node)) return
    isFocus.value = false
    closeList()
}

const toggleList = () => {
    if (countriesListRef.value?.offsetParent) {
        closeList()
    } else {
        openList()
    }
}

const openList = () => {
    if (!props.disabled) {
        CountrySelectorRef.value?.focus()
        emit('open')
        isFocus.value = true
        hasListOpen.value = true
        if (props.value) scrollToSelectedOnFocus(selectedValueIndex.value)
    }
}

const closeList = () => {
    emit('close')
    hasListOpen.value = false
}

const updateValue = async (val: string | null) => {
    tmpValue.value = val
    emit('input', val || null)
    await nextTick()
    closeList()
}

const scrollToSelectedOnFocus = (arrayIndex: number | null) => {
    if (arrayIndex === null) return
    nextTick(() => {
        if (countriesListRef.value) {
            countriesListRef.value.scrollTop =
                arrayIndex * (props.countriesHeight + 1) - (props.countriesHeight + 1) * 3
        }
    })
}

const keyboardNav = (e: KeyboardEvent) => {
    const code = e.key
    if (code === 'ArrowDown' || code === 'ArrowUp') {
        e.preventDefault()
        if (!hasListOpen.value) openList()
        let index = code === 'ArrowDown' ? tmpValueIndex.value + 1 : tmpValueIndex.value - 1
        if (index === -1 || index >= countriesSorted.value.length) {
            index = index === -1 ? countriesSorted.value.length - 1 : 0
        }
        tmpValue.value = countriesSorted.value[index].iso2
        scrollToSelectedOnFocus(index)
    } else if (code === 'Enter') {
        hasListOpen.value ? updateValue(tmpValue.value) : openList()
    } else if (code === 'Escape') {
        closeList()
    } else {
        searching(e)
    }
}

const searching = (e: KeyboardEvent) => {
    const code = e.keyCode
    clearTimeout(queryTimer)
    queryTimer = setTimeout(() => {
        query.value = ''
    }, 1000)
    const q = String.fromCharCode(code)
    if (code === 8 && query.value !== '') {
        query.value = query.value.substring(0, query.value.length - 1)
    } else if (/[a-zA-Z-e ]/.test(q)) {
        if (!hasListOpen.value) openList()
        query.value += e.key
        const countries = props.preferredCountries
            ? countriesSorted.value.slice(props.preferredCountries.length)
            : countriesSorted.value
        const resultIndex = countries.findIndex((c: any) => {
            tmpValue.value = c.iso2
            return c.name.toLowerCase().startsWith(query.value)
        })
        if (resultIndex !== -1) {
            scrollToSelectedOnFocus(
                resultIndex + (props.preferredCountries ? props.preferredCountries.length : 0),
            )
        }
    }
}

watch(
    () => props.value,
    (newValue) => {
        tmpValue.value = newValue
    },
)
</script>

<style lang="scss" scoped>
@import '@/components/atoms/PhoneNumberInput/assets/variables.scss';
@import 'style-helpers';
@import './assets/iti-flags/flags.css';

// Light Theme
.country-selector {
    font-family:
        Roboto,
        -apple-system,
        BlinkMacSystemFont,
        Segoe UI,
        Oxygen,
        Ubuntu,
        Cantarell,
        Fira Sans,
        Droid Sans,
        Helvetica Neue,
        sans-serif;
    position: relative;
    height: 40px;
    min-height: 40px;
    z-index: 0;
    user-select: none;

    &:hover {
        z-index: 1;
    }

    &__label {
        position: absolute;
        top: 3px;
        cursor: pointer;
        left: 11px;
        transform: translateY(25%);
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        font-size: 11px;
        color: $secondary-color;
    }

    &__input {
        cursor: pointer;
        background-color: $bg-color;
        position: relative;
        width: 100%;
        height: 40px;
        min-height: 40px;
        padding-right: 22px;
        font-weight: 400;
        appearance: none;
        outline: none;
        border: 1px solid $third-color;
        font-size: 13px;
        z-index: 0;
        padding-left: 8px;
        color: $text-color;
    }

    &__toggle {
        position: absolute;
        right: 5px;
        top: calc(50% - 10px);
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        text-align: center;
        display: inline-block;
        cursor: pointer;
        height: 24px;

        &__arrow {
            color: $secondary-color;

            path.arrow {
                fill: $secondary-color;
            }
        }
    }

    &__country-flag {
        margin: auto 0;
        position: absolute;
        top: 21px;
        left: 11px;
        z-index: 1;
        cursor: pointer;

        img {
            position: absolute;
        }
    }

    &__list {
        max-width: 100%;
        top: 100%;
        width: 100%;
        min-width: 230px;
        position: absolute;
        background-color: $bg-color;
        overflow: hidden;
        box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12);
        z-index: 9;
        list-style: none;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
        margin: 0;

        &.has-calling-code {
            min-width: 270px;
        }

        &__item {
            padding: 0 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 12px;
            cursor: pointer;
            background-color: transparent;
            width: 100%;
            border: 0;
            outline: none;

            &__flag-container {
                margin-right: 10px;
            }

            &__calling-code {
                width: 45px;
                color: $muted-color;
            }

            &.hover,
            &.keyboard-selected {
                background-color: $hover-color;
            }

            &.selected {
                color: #fff;
                font-weight: 600;

                .country-selector__list__item__calling-code {
                    color: #fff;
                }
            }
        }
    }

    // Dark Theme
    &.is-dark {
        .country-selector {
            &__input {
                cursor: pointer;
                color: $secondary-color-dark;

                &::-webkit-input-placeholder {
                    color: $secondary-color-dark;
                }

                &::-moz-placeholder {
                    color: $secondary-color-dark;
                }

                &:-ms-input-placeholder {
                    color: $secondary-color-dark;
                }

                &::-ms-input-placeholder {
                    color: $secondary-color-dark;
                }

                &:-moz-placeholder {
                    color: $secondary-color-dark;
                }

                &::placeholder {
                    color: $secondary-color-dark;
                }
            }

            &__toggle {
                &__arrow {
                    color: $secondary-color-dark;

                    path.arrow {
                        fill: $secondary-color-dark;
                    }
                }
            }

            &__list {
                &__item {
                    color: $text-color-dark;

                    &:hover,
                    &.keyboard-selected {
                        background-color: lighten($hover-color-dark, 10%);
                    }
                }

                &__calling-code {
                    color: $muted-color-dark;
                }
            }
        }

        .country-selector__input,
        .country-selector__list {
            color: $secondary-color-dark;
        }
    }

    &.has-list-open {
        z-index: 1;

        .country-selector {
            &__toggle {
                transform: rotate(180deg);
            }
        }
    }

    &.is-focused {
        z-index: 1;
    }

    &.has-error {
        .country-selector__input {
            border-color: $danger-color;
        }

        .country-selector__label {
            color: $danger-color;
        }
    }

    &.has-value {
        .country-selector__input {
            padding-left: 40px;
        }
    }

    &.has-value,
    &.has-hint {
        .country-selector__label {
            opacity: 1;
            transform: translateY(0);
            font-size: 11px;
        }

        .country-selector__input {
            padding-top: 14px;
        }
    }

    // Disable theme
    &.is-disabled {
        .country-selector {
            cursor: not-allowed;

            &__input {
                border-color: #ccc;
                background-color: #f2f2f2;
                color: $disabled-color;

                &::-webkit-input-placeholder {
                    color: $disabled-color;
                }

                &::-moz-placeholder {
                    color: $disabled-color;
                }

                &:-ms-input-placeholder {
                    color: $disabled-color;
                }

                &::-ms-input-placeholder {
                    color: $disabled-color;
                }

                &:-moz-placeholder {
                    color: $disabled-color;
                }

                &::placeholder {
                    color: $disabled-color;
                }
            }

            &__label,
            &__input,
            &__toggle__arrow,
            &__country-flag,
            &__country-flag > div {
                cursor: not-allowed;
                color: $disabled-color;
            }
        }
    }

    &.no-flags {
        .country-selector__input {
            padding-left: 10px;
        }
    }

    &.sm {
        height: 36px;
        min-height: 36px;

        .country-selector__input {
            height: 36px;
            min-height: 36px;
            font-size: 12px;
        }

        .country-selector__label {
            font-size: 10px;
        }

        .country-selector__country-flag {
            top: 16px;

            img {
                zoom: 0.3;
                color: red;
                /* stylelint-disable */
                -moz-transform: scale(0.3);
                -moz-transform-origin: 0 0;
                /* stylelint-enable */
            }
        }

        &.has-value {
            .country-selector__input {
                padding-top: 12px;
            }
        }
    }

    &.lg {
        height: 48px;
        min-height: 48px;

        .country-selector__input {
            height: 48px;
            min-height: 48px;
            font-size: 14px;
        }

        .country-selector__label {
            font-size: 14px;
        }

        .country-selector__country-flag {
            top: 25px;

            img {
                zoom: 0.45;
                /* stylelint-disable */
                -moz-transform: scale(0.45);
                -moz-transform-origin: 0 0;
                /* stylelint-enable */
            }
        }

        &.has-value {
            .country-selector__input {
                padding-top: 18px;
            }
        }
    }

    .slide-enter-active,
    .slide-leave-active {
        opacity: 1;
        z-index: 998;
        transition: all 0.3s;
        transform: translateY(0);
    }

    .slide-enter,
    .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        z-index: 998;
        transform: translateY(-20px);
    }
}
</style>
