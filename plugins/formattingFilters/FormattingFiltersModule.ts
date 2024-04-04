import type { FormattingFiltersInterface } from '~/plugins/formattingFilters/FormattingFiltersInterface'
import { CurrencyFilters } from '~/plugins/formattingFilters/currency/CurrencyFilters'
import { TextFilters } from '~/plugins/formattingFilters/text/TextFilters'
import { DateTimeFilters } from '~/plugins/formattingFilters/dateAndTime/DateTimeFilters'

export class FormattingFiltersModule implements FormattingFiltersInterface {
    currency: CurrencyFilters
    text: TextFilters
    dateTime: DateTimeFilters

    constructor() {
        this.currency = new CurrencyFilters()
        this.text = new TextFilters()
        this.dateTime = new DateTimeFilters()
    }
}
