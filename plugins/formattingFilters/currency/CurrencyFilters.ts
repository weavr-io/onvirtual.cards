export class CurrencyFilters {
    formatCurrencyWithCode(amount: number | string, currency?: string) {
        const formattedAmount: string = this.doFormatMoney(amount, {
            currency,
            currencyDisplay: 'code',
        })

        return formattedAmount
    }

    formatCurrencyWithSymbol(amount: number | string, currency?: string) {
        const formattedAmount: string = this.doFormatMoney(amount, {
            currency,
            currencyDisplay: 'symbol',
        })

        return formattedAmount
    }

    formatCurrencyWithOperator(amount: number | string, currency?: string) {
        const formattedAmount: string = this.formatCurrencyWithSymbol(amount, currency)

        if (+amount > 0) {
            return '+' + formattedAmount
        } else {
            return formattedAmount
        }
    }

    formatRate(amount: string, currency?: string) {
        const newRate: string = this.doFormatMoney(amount, {
            currency,
            minimumFractionDigits: 4,
            currencyDisplay: 'symbol',
        })

        return newRate
    }

    doFormatMoney(amount: number | string, params?: Intl.NumberFormatOptions, divideBy?: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            currencyDisplay: 'code',
            ...params,
        })

        const divideAmountBy: number = typeof divideBy === 'undefined' ? 100 : divideBy

        return formatter.format(+amount / divideAmountBy)
    }
}
