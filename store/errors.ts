import { Module, Mutation } from 'vuex-module-decorators'
import { AxiosError } from 'axios'

import { StoreModule } from '~/store/storeModule'
import { CONFLICT_MESSAGE_CONST } from '~/plugins/weavr-multi/api/models/error/conflicts/generics/const/ConflictMessageConst'

@Module({
    name: 'errorsModule',
    namespaced: true,
    stateFactory: true,
})
export default class Errors extends StoreModule {
    errors: any = null
    conflict: any = null

    get conflictMessage() {
        if (this.conflict) {
            const out = CONFLICT_MESSAGE_CONST[this.conflict.errorCode] ?? this.conflict.errorCode
            return out ?? 'An error occurred. Please try again.'
        } else {
            return null
        }
    }

    @Mutation
    SET_CONFLICT(_conflict: AxiosError) {
        if (_conflict.response) {
            this.conflict = _conflict.response.data
        }
    }

    @Mutation
    SET_ERROR(errors: any) {
        this.errors = errors
    }

    @Mutation
    RESET_ERROR() {
        this.errors = null
        this.conflict = null
    }
}
