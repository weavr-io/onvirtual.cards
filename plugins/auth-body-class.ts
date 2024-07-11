export default defineNuxtPlugin((nuxtApp) => {
    // usehead not working for some reason
    nuxtApp.hook('app:created', () => {
        document.body.classList.add('bg-bg-colored')
    })
})
