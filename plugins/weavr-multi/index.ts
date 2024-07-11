import { ApiModule } from '~/plugins/weavr-multi/api/ApiModule'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            apiMulti: new ApiModule(),
        },
    }
})
