import { DateTime, type DateTimeFormatOptions } from 'luxon'

export const useLuxon = () => {
    const getStartOfMonth = computed(() => DateTime.now().startOf('month').toMillis())
    const getEndOfMonth = computed(() => DateTime.now().endOf('month').toMillis())

    const formatDate = (val) => {
        const timestamp = typeof val === 'string' ? parseInt(val, 10) : val

        const dateTime = DateTime.fromMillis(timestamp)

        if (dateTime.hasSame(DateTime.now(), 'year')) {
            return dateTime.toFormat('d MMMM')
        }

        return dateTime.toFormat('d MMMM yyyy')
    }

    return { formatDate, getStartOfMonth, getEndOfMonth }
}

export type { DateTimeFormatOptions }
