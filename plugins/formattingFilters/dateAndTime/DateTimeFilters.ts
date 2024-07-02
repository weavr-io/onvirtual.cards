import { DateTime } from 'luxon'

export class DateTimeFilters {
    formatMilliToDateTime(value) {
        if (!value) return '-'

        const date = DateTime.fromMillis(parseInt(value))
        return date.toFormat('yyyy-LL-dd HH:mm')
    }

    formatMilliToDate(value) {
        if (!value) return '-'

        const date = DateTime.fromMillis(parseInt(value))
        return date.isValid ? date.toFormat('dd/LL/yyyy') : '-'
    }

    formatToDate(value) {
        if (!value) return '-'

        const date = DateTime.fromObject({
            year: value.year,
            month: value.month,
            day: value.day,
        })

        return date.toFormat('yyyy-MM-dd')
    }
}
