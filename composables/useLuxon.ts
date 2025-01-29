import { DateTime, type DateTimeFormatOptions } from 'luxon'

export const useLuxon = () => {
    const getStartOfMonth = computed(() => DateTime.now().startOf('month').toMillis())
    const getEndOfMonth = computed(() => DateTime.now().endOf('month').toMillis())

    const formatDate = (val) => {
        const dateTime = DateTime.fromJSDate(val)

        if (dateTime.hasSame(DateTime.now(), 'year')) {
            return dateTime.toFormat('d MMMM')
        }

        return dateTime.toFormat('d MMMM yyyy')
    }

    return { formatDate, getStartOfMonth, getEndOfMonth }
}

export type { DateTimeFormatOptions }
