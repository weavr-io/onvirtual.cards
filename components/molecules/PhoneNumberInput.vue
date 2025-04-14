<template>
    <div :id="id" class="phone-number-input">
        <div class="select-country-container">
            <CountrySelectorIndex
                :id="`${uniqueId}_country_selector`"
                :key="reloadKey"
                ref="CountrySelector"
                v-model:value="countryCode"
                :countries-height="countriesHeight"
                :disabled="disabled"
                :hint="shouldChooseCountry ? translatedCountryName.countrySelectorError : ''"
                :ignored-countries="ignoredCountries"
                :items="codesCountries"
                :label="translatedCountryName.countrySelectorLabel"
                :only-countries="onlyCountries"
                :theme="theme"
                :valid="isValid && !noValidatorState"
                class="input-country-selector"
            >
                <template #arrow>
                    <slot name="arrow" />
                </template>
            </CountrySelectorIndex>
        </div>
        <div class="flex-1 w-100">
            <InputTel
                :id="`${uniqueId}_phone_number`"
                ref="phoneNumberInputEl"
                v-model:value="phoneNumber"
                :disabled="disabled"
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
import {
    AsYouType,
    type CountryCode,
    type Examples,
    getExampleNumber,
    parsePhoneNumberFromString,
} from 'libphonenumber-js'
import { computed } from 'vue'
import examples from 'libphonenumber-js/examples.mobile.json'
import InputTel from '@/components/atoms/PhoneNumberInput/InputTelephone/InputTelephoneIndex.vue'
import locales from '@/components/atoms/PhoneNumberInput/assets/locales'
import CountrySelectorIndex from '@/components/atoms/PhoneNumberInput/CountrySelector/CountrySelectorIndex.vue'
import {
    countries,
    countriesIso,
    type Payload,
    type PhoneCodeCountry,
    type Results,
} from '~/components/atoms/PhoneNumberInput/assets/ts/phoneCodeCountries'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

const phoneNumberInputEl = ref<typeof PhoneNumberInput | undefined>(undefined)

const isCountryAvailable = (locale) => {
    return countriesIso.includes(locale)
}

const props = withDefaults(
    defineProps<{
        value?: string
        id?: string
        color: string
        errorColor: string
        defaultCountryCode: CountryCode
        onlyCountries?: CountryCode[] | string[]
        ignoredCountries?: CountryCode[]
        translations?: {} | null
        noValidatorState?: boolean
        error: boolean
        noExample?: boolean
        countriesHeight?: number
        noUseBrowserLocale?: boolean
        fetchCountry?: boolean
        borderRadius?: number
        disabled?: boolean
    }>(),
    {
        value: '',
        id: 'MazPhoneNumberInput',
        color: 'dodgerblue',
        errorColor: 'orangered',
        defaultCountryCode: 'GB',
        onlyCountries: () => [],
        ignoredCountries: () => [],
        translations: null,
        noValidatorState: false,
        error: false,
        noExample: false,
        countriesHeight: 30,
        noUseBrowserLocale: false,
        fetchCountry: false,
        borderRadius: 4,
        disabled: false,
    },
)

const emit = defineEmits(['update', 'input', 'phone-number-focused', 'phone-number-blur'])
const results = ref<Results>()
const userLocale = ref(props.defaultCountryCode)
const lastKeyPressed = ref(0)
const uniqueId = computed(() => `${props.id}-${Math.random().toString(36).substring(2, 9)}`)
const reloadKey = ref(0)

const translatedCountryName = computed(() => ({
    ...locales,
    ...props.translations,
}))

const codesCountries: ComputedRef<PhoneCodeCountry[]> = computed(() => countries)

const countryCode: Ref<CountryCode> = computed({
    get() {
        return userLocale.value || results.value?.countryCode
    },
    set(newCountry) {
        setLocale(newCountry)
        phoneNumberInputEl.value?.$el.querySelector('input').focus()
    },
})

const phoneNumber = computed({
    get() {
        return props.value
    },
    set(newPhone) {
        emitValues({ countryCode: countryCode.value, phoneNumber: newPhone })
    },
})

const shouldChooseCountry = computed(() => {
    return !countryCode.value && !!phoneNumber.value
})

const isValid = computed(() => !!results.value?.isValid)

const phoneNumberExample = computed(() => {
    const exampleNumber = countryCode.value
        ? getExampleNumber(countryCode.value, examples as unknown as Examples)
        : null
    return exampleNumber?.formatNational() ?? null
})

const hasEmptyPhone = computed(() => phoneNumber.value === '' || phoneNumber.value === null)

const hintValue = computed(() => {
    if (props.noExample || !phoneNumberExample.value) {
        return ''
    }

    if (hasEmptyPhone.value || isValid.value) {
        return ''
    }

    return `${translatedCountryName.value.example} ${phoneNumberExample.value}`
})

const theme = computed(() => {
    return {
        colorValue: props.color,
        color: { color: props.color },
        errorColor: { color: props.errorColor },
        bgColor: { backgroundColor: props.color },
        bgErrorColor: { backgroundColor: props.errorColor },
        borderColor: { borderColor: props.color },
        borderErrorColor: { borderColor: props.errorColor },
        borderRadius: { borderRadius: `${props.borderRadius}px` },
    }
})

function emitValues(payload: Payload) {
    let asYouType = getAsYouTypeFormat(payload)
    const backSpacePressed = lastKeyPressed.value === 8

    nextTick(() => {
        const lastCharacOfPhoneNumber = props.value ? props.value.trim().slice(-1) : false
        if (
            backSpacePressed &&
            lastCharacOfPhoneNumber &&
            lastCharacOfPhoneNumber.slice(-1) === ')'
        ) {
            asYouType = props.value?.slice(0, -2) ?? null
            payload.phoneNumber = props.value?.slice(0, -2)
        }
        results.value = getParsePhoneNumberFromString(payload.phoneNumber, payload.countryCode)
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

            emitValues({
                phoneNumber: newPhoneNumber,
                countryCode: countryCode.value || parsedPhoneNumber?.country,
            })
        }
    },
    { immediate: true },
)

onMounted(() => {
    if (phoneNumber.value && props.defaultCountryCode) {
        emitValues({
            countryCode: props.defaultCountryCode,
            phoneNumber: phoneNumber.value,
        })
    }
})

function getAsYouTypeFormat(payload) {
    const { countryCode, phoneNumber } = payload
    const asYouType = new AsYouType(countryCode)
    return phoneNumber ? asYouType.input(phoneNumber) : null
}

function setLocale(locale) {
    const countryAvailable = isCountryAvailable(locale)
    if (countryAvailable && locale) {
        reloadKey.value++
        userLocale.value = countryAvailable ? locale : null
        emitValues({ countryCode: locale, phoneNumber: props.value })
    }
}

function getParsePhoneNumberFromString(phoneNumber: string, countryCode: CountryCode) {
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
.phone-number-input {
    display: flex;

    .select-country-container {
        flex: 0 0 120px;
        max-width: 120px;
        min-width: 120px;
        width: 120px;
    }
}
</style>
