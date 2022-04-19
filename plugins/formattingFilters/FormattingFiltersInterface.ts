import { CurrencyFilters } from '~/plugins/formattingFilters/currency/CurrencyFilters'
import { TextFilters } from '~/plugins/formattingFilters/text/TextFilters'
import { DateTimeFilters } from '~/plugins/formattingFilters/dateAndTime/DateTimeFilters'

export interface FormattingFiltersInterface {
    currency: CurrencyFilters
    text: TextFilters
    dateTime: DateTimeFilters
}
