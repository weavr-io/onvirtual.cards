import axios from 'axios'
import { Mutation } from 'vuex-module-decorators'
import { Action, Module } from '~/node_modules/vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { AccessCodeModel } from '~/plugins/weavr-multi/api/models/access-codes/models/AccessCodeModel'

@Module({
    name: 'accessCodesModule',
    stateFactory: true,
    namespaced: true,
})
export default class AccessCodes extends StoreModule {
    isValid: boolean = false

    @Mutation
    SET_ACCESS_CODE(code) {
        localStorage.setItem('onv-access-code', code)
        this.isValid = true
    }

    @Mutation
    DELETE_ACCESS_CODE() {
        localStorage.removeItem('onv-access-code')
    }

    @Action({ rawError: true })
    verifyAccessCode(request: AccessCodeModel) {
        const req = this.store.$apiMulti.accessCodes.verifyAccessCode(request)

        req.then(() => {
            this.SET_ACCESS_CODE(request.code)
        }).catch(this.DELETE_ACCESS_CODE)

        return req
    }
}
