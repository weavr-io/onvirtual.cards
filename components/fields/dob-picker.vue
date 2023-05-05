<template>
    <div class="vue-dob-picker">
        <label :class="labelClass" :style="{ flex: proportions[0] }">
            <div v-if="showLabels !== 'false'">{{ labels[0] }}</div>
            <select v-model="day" :class="dayClass" @blur="onBlur" @focus="onFocus">
                <option v-if="placeholders[0]" disabled="disabled" value="null">
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
            <select v-model="month" :class="monthClass" @blur="onBlur" @focus="onFocus">
                <option v-if="placeholders[1]" disabled="disabled" value="null">
                    {{ placeholders[1] }}
                </option>
                <option v-for="(item, index) in new Array(12)" :key="index" :value="index">
                    {{ getDisplayedMonth(index) }}
                </option>
            </select>
        </label>
        <label :class="labelClass" :style="{ flex: proportions[2] }">
            <div v-if="showLabels !== 'false'">{{ labels[2] }}</div>
            <select v-model="year" :class="yearClass" @blur="onBlur" @focus="onFocus">
                <option v-if="placeholders[2]" disabled="disabled" value="null">
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

<script>
const datesInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default {
    name: 'VueDobPicker',
    props: {
        value: {
            type: Date,
        },
        selectClass: String,
        selectPlaceholderClass: String,
        labelClass: String,
        showLabels: String,
        locale: {
            type: String,
            default: navigator.language,
        },
        monthFormat: {
            type: String,
            default: '2-digit',
        },
        proportions: {
            type: Array,
            default: () => [1, 1, 2],
        },
        labels: {
            type: Array,
            default: () => ['Date', 'Month', 'Year'],
        },
        placeholders: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            day: null,
            month: null,
            year: null,
            currentYear: new Date().getFullYear(),
            blurTimeout: null,
        }
    },
    computed: {
        date: {
            get() {
                let daysInMonth = this.daysInMonth
                if (this.isLeapYear && this.month === 1) {
                    daysInMonth += 1
                }
                if (this.day > daysInMonth) {
                    this.day = null
                }
                if (this.day !== null && this.month !== null && this.year !== null) {
                    return new Date(this.year, this.month, this.day, 0, 0, 0, 0)
                }
                return null
            },
            set(val) {
                if (val) {
                    this.day = val.getDate()
                    this.month = val.getMonth()
                    this.year = val.getFullYear()
                }
            },
        },
        daysInMonth() {
            return datesInMonths[this.month] || 31
        },
        isLeapYear() {
            return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0
        },
        dayClass() {
            if (this.selectPlaceholderClass && this.day === null) {
                return this.selectPlaceholderClass
            }
            return this.selectClass
        },
        monthClass() {
            if (this.selectPlaceholderClass && this.month === null) {
                return this.selectPlaceholderClass
            }
            return this.selectClass
        },
        yearClass() {
            if (this.selectPlaceholderClass && this.year === null) {
                return this.selectPlaceholderClass
            }
            return this.selectClass
        },
    },
    watch: {
        date() {
            if (this.date) {
                this.$emit('input', this.date)
            }
        },
    },
    created() {
        this.date = this.value
    },
    methods: {
        getDisplayedMonth(monthNum) {
            const monthDateObj = new Date(2000, monthNum, 1)
            const locale = this.locale || navigator.language
            return monthDateObj.toLocaleString(locale, { month: this.monthFormat })
        },
        onBlur() {
            this.blurTimeout = window.setTimeout(() => {
                this.$emit('blur')
            }, 50)
        },
        onFocus() {
            window.clearTimeout(this.blurTimeout)
        },
    },
}
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
