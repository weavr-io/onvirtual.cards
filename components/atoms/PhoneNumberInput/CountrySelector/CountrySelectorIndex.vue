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
                'is-disabled': disabled,
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
            :disabled="disabled"
            :placeholder="label"
            :value="callingCode"
            class="country-selector-input"
            readonly
            @focus="isFocus = true"
            @keydown="keyboardNav"
            @click.stop="toggleList"
        />
        <div class="country-selector-toggle" @click.stop="toggleList">
            <img alt="Downward pointing arrow" src="@/assets/svg/statement/down_arrow.svg" />
        </div>
        <label
            ref="label"
            class="country-selector-label"
            for="country-selector"
            @click.stop="toggleList"
        >
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
                        class="d-flex align-center country-selector-list-item"
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
import { computed, ref, watch } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { type CountryCode, getCountryCallingCode } from 'libphonenumber-js'
import type { PhoneCodeCountry } from '~/components/atoms/PhoneNumberInput/assets/ts/phoneCodeCountries'

const emit = defineEmits(['input', 'open', 'close'])

const props = withDefaults(
    defineProps<{
        id: string
        value: CountryCode
        label: string
        hint: string
        valid: boolean
        items: PhoneCodeCountry[]
        onlyCountries: CountryCode[] | string[]
        ignoredCountries: CountryCode[]
        countriesHeight: number
        disabled?: boolean
    }>(),
    {
        id: 'CountrySelector',
        value: 'GB',
        label: 'Choose country',
        hint: '',
        valid: false,
        items: () => [],
        onlyCountries: () => ['GB'],
        ignoredCountries: () => ['GB'],
        countriesHeight: 35,
        disabled: false,
    },
)

const parent = ref(null)
const isFocus = ref(false)
const hasListOpen = ref(false)
const tmpValue = ref<CountryCode | undefined>(props.value)
const query = ref('')
const isHover = ref(false)
const countriesListRef = ref<HTMLElement | null>(null)
const CountrySelectorRef = ref<HTMLElement | null>(null)
let queryTimer: NodeJS.Timeout

const itemHeight = computed(() => {
    return { height: `${props.countriesHeight}px` }
})
const listHeight = computed(() => {
    return {
        height: `${(props.countriesHeight + 1) * 7}px`,
    }
})

const countriesList = props.items.filter(
    (item: any) => !props.ignoredCountries?.includes(item.iso2),
)

const countriesFiltered = computed(() => {
    const countries = props.onlyCountries
    return countries
        ? countries.map((country: CountryCode | string) =>
              countriesList.find((item: PhoneCodeCountry) => item.iso2 === country),
          )
        : []
})

const countriesSorted: Ref<(PhoneCodeCountry | undefined)[]> = computed(() => {
    return countriesFiltered.value.length ? countriesFiltered.value : countriesList
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
    if (!props.disabled) {
        CountrySelectorRef.value?.focus()
        emit('open')
        isFocus.value = true
        hasListOpen.value = true
        if (props.value) scrollToSelectedOnFocus(selectedValueIndex.value)
    }
}

function closeList() {
    emit('close')
    hasListOpen.value = false
}

const handleBlur = () => {
    isFocus.value = false
    if (!isHover.value) {
        closeList()
    }
}

function toggleList() {
    return hasListOpen.value ? closeList() : openList()
}

const updateValue = async (val: CountryCode | undefined) => {
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
    let index

    switch (code) {
        case 'ArrowDown':
        case 'ArrowUp':
            e.preventDefault()
            if (!hasListOpen.value) openList()
            index = code === 'ArrowDown' ? tmpValueIndex.value + 1 : tmpValueIndex.value - 1
            if (index === -1 || index >= countriesSorted.value.length) {
                index = index === -1 ? countriesSorted.value.length - 1 : 0
            }
            tmpValue.value = countriesSorted.value[index]?.iso2
            scrollToSelectedOnFocus(index)
            break
        case 'Enter':
            hasListOpen.value ? updateValue(tmpValue.value) : openList()
            break
        case 'Escape':
            closeList()
            break
        default:
            searching(e)
            break
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
        const countries = countriesSorted.value
        const resultIndex = countries.findIndex((c: any) => {
            tmpValue.value = c.iso2
            return c.name.toLowerCase().startsWith(query.value)
        })
        if (resultIndex !== -1) {
            scrollToSelectedOnFocus(resultIndex)
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
@import './assets/iti-flags/flags.css';
</style>
