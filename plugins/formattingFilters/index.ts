import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.provide('formattingFilters', new FormattingFiltersModule())
})
