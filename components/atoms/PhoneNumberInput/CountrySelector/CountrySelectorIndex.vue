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
        <div v-if="value" class="country-selector-country-flag" @click.stop="toggleList">
            <div :class="`iti-flag-small iti-flag ${value.toLowerCase()}`" />
        </div>
        <input
            :id="id"
            ref="CountrySelector"
            :placeholder="label"
            :value="callingCode"
            class="country-selector-input"
            readonly
            @focus="isFocus = true"
            @keydown="keyboardNav"
            @click.stop="toggleList"
        />
        <div class="country-selector-toggle" @click.stop="toggleList">
            <slot name="arrow">
                <svg height="24" mlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24">
                    <path
                        class="arrow"
                        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                    />
                    <path d="M0 0h24v24H0V0z" fill="none" />
                </svg>
            </slot>
        </div>
        <label ref="label" class="country-selector-label" @click.stop="toggleList">
            {{ hint || label }}
        </label>
        <Transition name="slide">
            <div
                v-show="hasListOpen"
                ref="countriesListRef"
                :style="[{ borderRadius: '4px' }, listHeight]"
                class="country-selector-list"
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
                        class="flex align-center country-selector-list-item"
                        tabindex="-1"
                        type="button"
                        @click.stop="updateValue(item.iso2)"
                    >
                        <div class="country-selector-list-item-flag-container">
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
@import 'style-helpers';
@import './assets/iti-flags/flags.css';
</style>
