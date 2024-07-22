<template>
    <div class="vue-dob-picker">
        <label :class="labelClass" :style="{ flex: proportions[0] }">
            <div v-if="showLabels !== 'false'">{{ labels[0] }}</div>
            <select
                v-model="day"
                :class="[dayClass, { 'is-invalid': state?.day === false }]"
                @blur="onBlur"
                @focus="onFocus"
            >
                <option v-if="placeholders[0]" value="null">
                    {{ placeholders[0] }}
                </option>
                <option v-for="(item, index) in new Array(28)" :key="index" :value="index + 1">
                    {{ index + 1 }}
                </option>
                <option v-if="daysInMonth >= 29 || isLeapYear" value="29">29</option>
                <option v-if="daysInMonth >= 30" value="30">30</option>
                <option v-if="daysInMonth >= 31" value="31">31</option>
            </select>
        </label>
        <label :class="labelClass" :style="{ flex: proportions[1] }">
            <div v-if="showLabels !== 'false'">{{ labels[1] }}</div>
            <select
                v-model="month"
                :class="[monthClass, { 'is-invalid': state?.month === false }]"
                @blur="onBlur"
                @focus="onFocus"
            >
                <option v-if="placeholders[1]" value="null">
                    {{ placeholders[1] }}
                </option>
                <option v-for="(item, index) in new Array(12)" :key="index" :value="index">
                    {{ getDisplayedMonth(index) }}
                </option>
            </select>
        </label>
        <label :class="labelClass" :style="{ flex: proportions[2] }">
            <div v-if="showLabels !== 'false'">{{ labels[2] }}</div>
            <select
                v-model="year"
                :class="[yearClass, { 'is-invalid': state?.year === false }]"
                @blur="onBlur"
                @focus="onFocus"
            >
                <option v-if="placeholders[2]" value="null">
                    {{ placeholders[2] }}
                </option>
                <option
                    v-for="(item, index) in new Array(100)"
                    :key="index"
                    :value="currentYear - index"
                >
                    {{ currentYear - index }}
                </option>
            </select>
        </label>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onBeforeMount, watch } from '@nuxtjs/composition-api'
import { DateTimeFormatOptions } from '~/composables/useLuxon'

const datesInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const props = withDefaults(
    defineProps<{
        value?: Date
        selectClass?: string
        selectPlaceholderClass?: string
        labelClass?: string
        showLabels?: string
        locale?: string
        monthFormat?: DateTimeFormatOptions['month']
        proportions?: number[]
        labels?: string[]
        placeholders?: string[]
        state?: { day?: boolean; month?: boolean; year?: boolean }
    }>(),
    {
        value: undefined,
        selectClass: '',
        selectPlaceholderClass: '',
        labelClass: '',
        showLabels: '',
        locale: 'en-US',
        monthFormat: '2-digit',
        proportions: () => [1, 1, 2],
        labels: () => ['Date', 'Month', 'Year'],
        placeholders: () => [],
        state: undefined,
    },
)

const day = ref<null | number>(null)
const month = ref<null | number>(null)
const year = ref<null | number>(null)
const currentYear = new Date().getFullYear()
const blurTimeout = ref(0)

const emit = defineEmits(['blur', 'input'])
const daysInMonth = computed(() => (month.value ? datesInMonths[month.value] : 31))

const date = computed({
    get() {
        const _daysInMonth = ref(daysInMonth.value)
        if (isLeapYear.value && month.value === 1) {
            _daysInMonth.value += 1
        }
        if (day.value && day.value > daysInMonth.value) {
            return undefined
        }
        if (day.value !== null && month.value !== null && year.value !== null) {
            return new Date(year.value, month.value, day.value, 0, 0, 0, 0)
        }
        return undefined
    },
    set(val) {
        if (val) {
            day.value = val.getDate()
            month.value = val.getMonth()
            year.value = val.getFullYear()
        }
    },
})

const isLeapYear = computed(() => {
    if (year.value !== null) {
        return (year.value % 4 === 0 && year.value % 100 !== 0) || year.value % 400 === 0
    }

    return false
})

const dayClass = computed(() => {
    if (props.selectPlaceholderClass && day.value === null) {
        return props.selectPlaceholderClass
    }
    return props.selectClass
})

const monthClass = computed(() => {
    if (props.selectPlaceholderClass && month.value === null) {
        return props.selectPlaceholderClass
    }
    return props.selectClass
})

const yearClass = computed(() => {
    if (props.selectPlaceholderClass && year.value === null) {
        return props.selectPlaceholderClass
    }
    return props.selectClass
})

watch(date, (val) => {
    if (val) {
        emit('input', val)
    }
})

const getDisplayedMonth = (monthNum: number) => {
    const monthDateObj = new Date(2000, monthNum, 1)
    const locale = props.locale || navigator.language
    return monthDateObj.toLocaleString(locale, { month: props.monthFormat })
}

const fullDob = computed(() => {
    return {
        day: day.value,
        month: month.value,
        year: year.value,
    }
})

const onBlur = () => {
    blurTimeout.value = window.setTimeout(() => {}, 50)
    emit('blur', fullDob)
}

const onFocus = () => {
    window.clearTimeout(blurTimeout.value)
}

onBeforeMount(() => {
    date.value = props.value
})
</script>

<style scoped>
.vue-dob-picker {
    display: flex;
}

label {
    display: inline-block;
    padding: 0 4px;
}

label:first-child {
    padding-left: 0;
}

label:last-child {
    padding-right: 0;
}

select {
    width: 100%;
}
</style>
