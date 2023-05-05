import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import { UsersFilterRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UsersFilterRequestModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'

const defaultState = {
    users: null,
    user: null,
}

@Module({
    name: 'usersModule',
    stateFactory: true,
    namespaced: true,
})
export default class Users extends StoreModule {
    users: PaginatedUsersResponseModel | null = defaultState.users
    user: UserModel | null = defaultState.user

    @Mutation
    RESET_STATE() {
        Object.keys(defaultState).forEach((key) => {
            this[key] = defaultState[key]
        })
    }

    @Mutation
    SET_USERS(_users: PaginatedUsersResponseModel) {
        this.users = _users
    }

    @Mutation
    SET_USER(_user: UserModel) {
        this.user = _user
    }

    @Action({ rawError: true })
    index(filter?: UsersFilterRequestModel) {
        const _req = this.store.$apiMulti.users.index(filter)

        _req.then((res) => {
            this.SET_USERS(res.data)
        })

        return _req
    }

    @Action({ rawError: true })
    show(id: IDModel) {
        const _req = this.store.$apiMulti.users.show(id)

        _req.then((res) => {
            this.SET_USER(res.data)
        })

        return _req
    }

    @Action({ rawError: true })
    update(params: { id: IDModel; data: UpdateUserRequestModel }) {
        const _req = this.store.$apiMulti.users.update(params)

        _req.then((res) => {
            this.SET_USER(res.data)
        })

        return _req
    }

    @Action({ rawError: true })
    add(body: CreateUserRequestModel) {
        return this.store.$apiMulti.users.store(body)
    }

    @Action({ rawError: true })
    deactivate(id: IDModel) {
        return this.store.$apiMulti.users.deactivate(id)
    }

    @Action({ rawError: true })
    inviteSend(id: IDModel) {
        return this.store.$apiMulti.users.inviteSend(id)
    }

    @Action({ rawError: true })
    inviteValidate(params: { id: IDModel; data: InviteValidateRequestModel }) {
        return this.store.$apiMulti.users.inviteValidate(params)
    }

    @Action({ rawError: true })
    inviteConsume(params: { id: IDModel; data: InviteConsumeRequestModel }) {
        return this.store.$apiMulti.users.inviteConsume(params)
    }
}
