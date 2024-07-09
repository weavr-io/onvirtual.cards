import InfiniteLoading from 'vue-infinite-loading'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.component('InfiniteLoading', InfiniteLoading)
})
