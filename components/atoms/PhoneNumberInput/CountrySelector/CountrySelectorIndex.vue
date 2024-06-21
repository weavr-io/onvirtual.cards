<template>
    <div
        ref="parent"
        :class="[
            {
                'is-focused': isFocus,
                'has-value': value,
                'has-hint': hint,
                'has-list-open': hasListOpen,
                'is-valid': valid,
            },
        ]"
        class="country-selector"
        @mouseenter="updateHoverState(true)"
        @mouseleave="updateHoverState(false)"
        @blur.capture="handleBlur"
    >
        <div v-if="value" class="country-selector__country-flag" @click.stop="toggleList">
            <div :class="`iti-flag-small iti-flag ${value.toLowerCase()}`" />
        </div>
        <input
            :id="id"
            ref="CountrySelector"
            :placeholder="label"
            :value="callingCode"
            class="country-selector__input"
            readonly
            @focus="isFocus = true"
            @keydown="keyboardNav"
            @click.stop="toggleList"
        />
        <div class="country-selector__toggle" @click.stop="toggleList">
            <slot name="arrow">
                <svg
                    class="country-selector__toggle__arrow"
                    height="24"
                    mlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <path
                        class="arrow"
                        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                    />
                    <path d="M0 0h24v24H0V0z" fill="none" />
                </svg>
            </slot>
        </div>
        <label ref="label" class="country-selector__label" @click.stop="toggleList">
            {{ hint || label }}
        </label>
        <Transition name="slide">
            <div
                v-show="hasListOpen"
                ref="countriesListRef"
                :style="[{ borderRadius: '4px' }, listHeight]"
                class="country-selector__list"
            >
                <RecycleScroller
                    v-slot="{ item }"
                    :item-size="1"
                    :items="countriesSorted"
                    key-field="iso2"
                >
                    <button
                        :key="`item-${item.code}`"
                        :class="[
                            { selected: value === item.iso2 },
                            { 'keyboard-selected': value !== item.iso2 && tmpValue === item.iso2 },
                        ]"
                        :style="[
                            itemHeight,
                            value === item.iso2 ? { backgroundColor: '#6d1c5d' } : {},
                        ]"
                        class="flex align-center country-selector__list__item"
                        tabindex="-1"
                        type="button"
                        @click.stop="updateValue(item.iso2)"
                    >
                        <div class="country-selector__list__item__flag-container">
                            <div :class="`iti-flag-small iti-flag ${item.iso2.toLowerCase()}`" />
                        </div>
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
import { computed, defineProps, ref, watch } from 'vue'
import { getCountryCallingCode } from 'libphonenumber-js'
import { RecycleScroller } from 'vue-virtual-scroller'
import { nextTick } from '@nuxtjs/composition-api'

const emit = defineEmits(['input', 'open', 'close'])

const props = withDefaults(
    defineProps<{
        id: string
        value: any
        label: string
        hint: string
        valid: boolean
        items: string[]
        preferredCountries: string[]
        onlyCountries: string[]
        ignoredCountries: string[]
        countriesHeight: number
    }>(),
    {
        id: 'CountrySelector',
        value: null,
        label: 'Choose country',
        hint: '',
        valid: false,
        items: () => [''],
        preferredCountries: () => [''],
        onlyCountries: () => [''],
        ignoredCountries: () => [''],
        countriesHeight: 35,
    },
)

const isFocus = ref(false)
const hasListOpen = ref(false)
const tmpValue = ref<string | null>(props.value)
const query = ref('')
const isHover = ref(false)
const countriesListRef = ref<HTMLElement | null>(null)
const CountrySelectorRef = ref<HTMLElement | null>(null)
let queryTimer: number | undefined

const itemHeight = computed(() => {
    return { height: `${props.countriesHeight}px` }
})
const listHeight = computed(() => {
    return {
        height: `${(props.countriesHeight + 1) * 7}px`,
        maxHeight: `${(props.countriesHeight + 1) * 7}px`,
    }
})

const countriesList = props.items.filter(
    (item: any) => !props.ignoredCountries?.includes(item.iso2),
)

const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries
        ? countries.map((country: any) =>
              countriesList.find((item: any) => item.iso2.includes(country)),
          )
        : []
})

const otherCountries = computed(() => {
    return countriesList.filter((item: any) => !props.preferredCountries?.includes(item.iso2))
})

const countriesSorted = computed(() => {
    return props.preferredCountries
        ? [...countriesFiltered.value, ...otherCountries.value]
        : props.onlyCountries
          ? countriesFiltered.value
          : countriesList
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

function openList() {
    CountrySelectorRef.value?.focus()
    emit('open')
    isFocus.value = true
    hasListOpen.value = true
    if (props.value) scrollToSelectedOnFocus(selectedValueIndex.value)
}

function closeList() {
    emit('close')
    hasListOpen.value = false
}

const handleBlur = () => {
    isFocus.value = false
    closeList()
}

function toggleList() {
    if (hasListOpen.value) {
        closeList()
    } else {
        openList()
    }
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
        tmpValue.value = countriesSorted.value[index]?.iso2
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

.country-selector {
    position: relative;
    height: 40px;
    min-height: 40px;
    z-index: 0;
    user-select: none;

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

            &.hover,
            &.keyboard-selected {
                background-color: $hover-color;
            }

            &.selected {
                color: #fff;
                font-weight: 600;
            }
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
}
</style>
