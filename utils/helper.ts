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
