import { ApiModule } from '~/plugins/weavr-multi/api/ApiModule'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.provide('apiMulti', new ApiModule())
})
