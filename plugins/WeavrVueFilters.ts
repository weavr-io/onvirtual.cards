import Vue from 'vue'
import type { BvToastOptions } from '~/node_modules/bootstrap-vue'

Vue.filter('weavr_currency_symbol', function (_currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: _currency,
        currencyDisplay: 'symbol',
    })

    return formatter.format(0)[0]
})

Vue.filter('weavr_currency', function (value, currency, fraction) {
    let amount = ''
    if (value && typeof value === 'object' && 'currency' in value && 'amount' in value) {
        currency = value.currency
        amount = value.amount
    } else {
        amount = value
    }

    if (typeof fraction === 'undefined') {
        fraction = 2
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: fraction,
        currencyDisplay: 'symbol',
    })
    return formatter.format(parseInt(amount) / 100)
})

Vue.filter('weavr_currency_with_operator', function (value, _currency) {
    let _amount = ''
    try {
        if (
            Object.prototype.hasOwn(value, 'currency') &&
            Object.prototype.hasOwn(value, 'amount')
        ) {
            _currency = value.currency
            _amount = value.amount
        } else {
            _amount = value
        }
    } catch (_) {
        // debugger
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: _currency,
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
    })

    const _formatted = formatter.format(parseInt(_amount) / 100)

    if (parseInt(_amount) > 0) {
        return '+' + _formatted
    } else {
        return _formatted
    }
})

Vue.filter('weavr_currency_gbp', function (value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        currencyDisplay: 'code',
    })

    return formatter.format(value / 100)
})

Vue.filter('weavr_thousands', function (value) {
    const formatter = new Intl.NumberFormat('en-US', {})
    return formatter.format(value)
})

Vue.filter('weavr_underscore', function (value) {
    return value.split('_').join(' ')
})

Vue.filter('weavr_coma_to_newline', function (value) {
    return value.split(',').join(',<br>')
})

Vue.filter('weavr_convert_camelcase', function (value) {
    const result = value.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
})

Vue.filter('weavr_lowercase', function (value) {
    return value.toLowerCase()
})

Vue.filter('card', function (value, _first6, _last4) {
    if (typeof _first6 === 'undefined' && typeof _last4 === 'undefined') {
        return value.replace(/(\+?\d{6})(\d+)(\d{4})/g, function (_match, start, middle, end) {
            return start + '*'.repeat(middle.length) + end
        })
    } else {
        return _first6 + '******' + _last4
    }
})

Vue.filter('expiryMmyy', function (value) {
    try {
        return value.match(/.{1,2}/g).join('/')
    } catch (error) {
        return value
    }
})

// eslint-disable-next-line no-empty-pattern
export default ({}, inject) => {
    inject('weavrToast', (message: string, options?: BvToastOptions) => {
        const vm = new Vue()

        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'success',
        }

        Object.assign(_options, options)

        vm.$bvToast.toast(message, _options)
    })
    inject('weavrToastError', (message: string, options?: BvToastOptions) => {
        const vm = new Vue()

        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'danger',
            title: 'An error occured!',
        }

        Object.assign(_options, options)

        vm.$bvToast.toast(message, _options)
    })
}

export type WeavrToast = (message: string, options?: BvToastOptions) => void

declare module 'vue/types/vue' {
    interface Vue {
        // Toast injection
        readonly $weavrToast: WeavrToast
        readonly $weavrToastError: WeavrToast
    }
}
