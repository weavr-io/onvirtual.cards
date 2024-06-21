<template>
    <div :id="id" class="vue-phone-number-input flex">
        <div class="select-country-container">
            <CountrySelectorIndex
                :id="`${uniqueId}_country_selector`"
                ref="CountrySelector"
                v-model="countryCode"
                :countries-height="countriesHeight"
                :error="shouldChooseCountry"
                :hint="shouldChooseCountry ? translatedCountryName.countrySelectorError : ''"
                :ignored-countries="ignoredCountries"
                :items="codesCountries"
                :label="translatedCountryName.countrySelectorLabel"
                :only-countries="onlyCountries"
                :preferred-countries="preferredCountries"
                :theme="theme"
                :valid="isValid && !noValidatorState"
                class="input-country-selector"
            >
                <slot slot="arrow" name="arrow" />
            </CountrySelectorIndex>
        </div>
        <div class="flex-1">
            <InputTel
                :id="`${uniqueId}_phone_number`"
                ref="phoneNumberInputEl"
                v-model="phoneNumber"
                :error="error"
                :hint="hintValue"
                :label="translatedCountryName.phoneNumberLabel"
                :theme="theme"
                :valid="isValid && !noValidatorState"
                class="input-phone-number"
                v-bind="$attrs"
                @blur="$emit('phone-number-blur')"
                @focus="$emit('phone-number-focused')"
                @keydown="
                    (e) => {
                        lastKeyPressed = e.keyCode
                    }
                "
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import examples from 'libphonenumber-js/examples.mobile.json'
import { AsYouType, getExampleNumber, parsePhoneNumberFromString } from 'libphonenumber-js'
import { computed, defineProps } from 'vue'
import { nextTick, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { countries, countriesIso } from '../atoms/PhoneNumberInput/assets/js/phoneCodeCountries.js'
import InputTel from '../atoms/PhoneNumberInput/InputTelephone/InputTelephoneIndex.vue'
import locales from '../atoms/PhoneNumberInput/assets/locales'
import CountrySelectorIndex from '../atoms/PhoneNumberInput/CountrySelector/CountrySelectorIndex.vue'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

const phoneNumberInputEl = ref<typeof PhoneNumberInput | undefined>(undefined)

const browserLocale = () => {
    if (!window) return null
    const browserLocale = window.navigator.language || window.navigator.language
    let locale = browserLocale ? browserLocale.substring(3, 4).toUpperCase() : null
    if (locale === '') locale = browserLocale.substring(0, 2).toUpperCase()
    return locale
}

const isCountryAvailable = (locale) => {
    return countriesIso.includes(locale)
}

const props = withDefaults(
    defineProps<{
        value: string
        id: string
        color: string
        errorColor: string
        defaultCountryCode: string | null
        preferredCountries: string[]
        onlyCountries: string[]
        ignoredCountries: string[]
        translations: {} | null
        noValidatorState: boolean
        error: boolean
        noExample: boolean
        countriesHeight: number
        noUseBrowserLocale: boolean
        fetchCountry: boolean
        borderRadius: number
    }>(),
    {
        value: '',
        id: 'MazPhoneNumberInput',
        color: 'dodgerblue',
        errorColor: 'orangered',
        defaultCountryCode: null,
        preferredCountries: null,
        onlyCountries: () => [''],
        ignoredCountries: () => [''],
        translations: null,
        noValidatorState: false,
        error: false,
        noExample: false,
        countriesHeight: 30,
        noUseBrowserLocale: false,
        fetchCountry: false,
        borderRadius: 4,
    },
)

const emit = defineEmits(['update', 'input', 'phone-number-focused', 'phone-number-blur'])
const results = ref({ countryCode: undefined, formatInternational: undefined, isValid: undefined })
const userLocale = ref(props.defaultCountryCode)
const lastKeyPressed = ref(0)
const phoneNumber = ref<string[] | string | number[] | null | undefined>('')

const uniqueId = computed(() => `${props.id}-${Math.random().toString(36).substring(2, 9)}`)

const translatedCountryName = computed(() => ({
    ...locales,
    ...props.translations,
}))

const codesCountries = computed(() => countries)

const countryCode = computed({
    get() {
        return userLocale.value || results.value.countryCode
    },
    set(newCountry) {
        setLocale(newCountry)
        phoneNumberInputEl.value?.$el.querySelector('input').focus()
    },
})

const shouldChooseCountry = computed(() => {
    return !countryCode.value && !!phoneNumber.value
})

const isValid = computed(() => results.value.isValid)

const phoneNumberExample = computed(() => {
    const exampleNumber = countryCode.value ? getExampleNumber(countryCode.value, examples) : null
    return exampleNumber ? exampleNumber.formatNational() : null
})

const hasEmptyPhone = computed(() => phoneNumber.value === '' || phoneNumber.value === null)

const hintValue = computed(() => {
    return props.noExample || !phoneNumberExample.value
        ? null
        : hasEmptyPhone.value || isValid.value
          ? null
          : `${translatedCountryName.value.example} ${phoneNumberExample.value}`
})

const theme = computed(() => {
    const getShadowColor = (color: string) => {
        return color
    }

    return {
        colorValue: props.color,
        color: { color: props.color },
        textDarkColor: { color: 'rgba(255, 255, 255, 0.7)' },
        errorColor: { color: props.errorColor },
        bgColor: { backgroundColor: props.color },
        bgErrorColor: { backgroundColor: props.errorColor },
        borderColor: { borderColor: props.color },
        borderErrorColor: { borderColor: props.errorColor },
        boxShadowColor: { boxShadow: `0 0 0 0.125rem ${getShadowColor(props.color)}` },
        boxShadowValid: { boxShadow: `0 0 0 0.125rem` },
        boxShadowError: { boxShadow: `0 0 0 0.125rem ${getShadowColor(props.errorColor)}` },
        borderRadius: { borderRadius: `${props.borderRadius}px` },
        borderLeftRadius: {
            borderTopLeftRadius: `${props.borderRadius}px`,
            borderBottomLeftRadius: `${props.borderRadius}px`,
        },
        borderRightRadius: {
            borderTopRightRadius: `${props.borderRadius}px`,
            borderBottomRightRadius: `${props.borderRadius}px`,
        },
    }
})

function emitValues(payload) {
    let asYouType = getAsYouTypeFormat(payload)
    const backSpacePressed = lastKeyPressed.value === 8

    nextTick(() => {
        const lastCharacOfPhoneNumber = props.value ? props.value.trim().slice(-1) : false
        if (
            backSpacePressed &&
            lastCharacOfPhoneNumber &&
            lastCharacOfPhoneNumber.slice(-1) === ')'
        ) {
            asYouType = props.value.slice(0, -2)
            payload.phoneNumber = props.value.slice(0, -2)
        }

        results.value = getParsePhoneNumberFromString(payload)
        emit('update', results.value)
        emit('input', asYouType)
    })
}

watch(
    () => props.defaultCountryCode,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            setLocale(newValue)
        }
    },
)

watch(
    [() => props.defaultCountryCode, () => phoneNumber.value],
    ([newCountryCode, newPhoneNumber], [oldCountryCode, oldPhoneNumber]) => {
        if (newCountryCode !== oldCountryCode) {
            setLocale(newCountryCode)
        }

        if (newPhoneNumber && newPhoneNumber !== oldPhoneNumber) {
            const parsedPhoneNumber = parsePhoneNumberFromString(newPhoneNumber, {
                defaultCountry: newCountryCode,
            })
            if (parsedPhoneNumber) {
                emitValues({
                    phoneNumber: parsedPhoneNumber.nationalNumber,
                    countryCode: countryCode.value ? countryCode.value : parsedPhoneNumber.country,
                })
            }
        }
    },
    { immediate: true },
)

async function fetchCountryCode() {
    try {
        const response = await fetch('https://ip2c.org/s')
        const responseText = await response.text()
        const result = (responseText || '').toString()
        if (result && result[0] === '1') setLocale(result.substring(2, 2))
    } catch (err) {}
}

onMounted(() => {
    try {
        if (phoneNumber && props.defaultCountryCode)
            emitValues({
                countryCode: props.defaultCountryCode,
                phoneNumber: phoneNumber.value,
            })

        if (props.defaultCountryCode) return

        return props.fetchCountry
            ? fetchCountryCode()
            : !props.noUseBrowserLocale
              ? setLocale(browserLocale())
              : null
    } catch (err) {}
})

function getAsYouTypeFormat(payload) {
    const { countryCode, phoneNumber } = payload
    const asYouType = new AsYouType(countryCode)
    return phoneNumber ? asYouType.input(phoneNumber) : null
}

function setLocale(locale) {
    const countryAvailable = isCountryAvailable(locale)
    if (countryAvailable && locale) {
        userLocale.value = countryAvailable ? locale : null
        emitValues({ countryCode: locale, phoneNumber: props.value })
    } else if (!countryAvailable && locale) {
        window.console.warn(`The locale ${locale} is not available`)
    }
}

function getParsePhoneNumberFromString({ phoneNumber, countryCode }) {
    const parsing =
        phoneNumber && countryCode ? parsePhoneNumberFromString(phoneNumber, countryCode) : null
    return {
        countryCode,
        isValid: false,
        ...(phoneNumber && phoneNumber !== '' ? { phoneNumber } : null),
        ...(parsing
            ? {
                  countryCallingCode: parsing.countryCallingCode,
                  formattedNumber: parsing.number,
                  nationalNumber: parsing.nationalNumber,
                  isValid: parsing.isValid(),
                  type: parsing.getType(),
                  formatInternational: parsing.formatInternational(),
                  formatNational: parsing.formatNational(),
                  uri: parsing.getURI(),
                  e164: parsing.format('E.164'),
              }
            : null),
    }
}
</script>
<style lang="scss" scoped>
@import '../../node_modules/style-helpers';

.vue-phone-number-input {
    .select-country-container {
        flex: 0 0 120px;
        width: 120px;
        min-width: 120px;
        max-width: 120px;
    }

    &.sm .select-country-container {
        flex: 0 0 110px;
        width: 110px;
        min-width: 110px;
        max-width: 110px;
    }

    &.lg .select-country-container {
        flex: 0 0 130px;
        width: 130px;
        min-width: 130px;
        max-width: 130px;
    }
}
</style>
