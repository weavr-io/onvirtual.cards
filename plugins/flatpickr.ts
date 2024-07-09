import VueFlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(VueFlatPickr)
})
