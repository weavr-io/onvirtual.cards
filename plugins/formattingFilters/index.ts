import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            formattingFilters: new FormattingFiltersModule(),
        },
    }
})
