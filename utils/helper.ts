export const weavrCurrency = (value, currency?, fraction?) => {
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
}

export const weavrCurrencySymbol = (_currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: _currency,
        currencyDisplay: 'symbol',
    })

    return formatter.format(0)[0]
}

export const weavrCurrencyWithOperator = (value, _currency?) => {
    let _amount = ''
    try {
        if (
            Object.prototype.hasOwnProperty.call(value, 'currency') &&
            Object.prototype.hasOwnProperty.call(value, 'amount')
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
    }

    return _formatted
}

export const weavrUnderscore = (value) => {
    return value.split('_').join(' ')
}

export const expiryMmyy = (value) => {
    try {
        return value.match(/.{1,2}/g).join('/')
    } catch (error) {
        return value
    }
}
