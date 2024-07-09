import { defineStore } from 'pinia'
import type { Users as UserState } from '~/local/models/store/users'
import type { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import type { UsersFilterRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UsersFilterRequestModel'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import type { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import type { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import type { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'

const initState = (): UserState => {
    return {
        users: null,
        user: null,
    }
}

export const useUsersStore = defineStore('users', () => {
    const { $apiMulti } = useNuxtApp()
    const userState: UserState = reactive(initState())

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            userState[key] = data[key]
        })
    }

    const setUsers = (_users: PaginatedUsersResponseModel) => {
        userState.users = _users
    }

    const setUser = (_user: UserModel) => {
        userState.user = _user
    }

    const index = (filter?: UsersFilterRequestModel) => {
        const _req = $apiMulti.users.index(filter)

        _req.then((res) => {
            setUsers(res.data)
        })

        return _req
    }

    const show = (id: IDModel) => {
        const _req = $apiMulti.users.show(id)

        _req.then((res) => {
            setUser(res.data)
        })

        return _req
    }

    const update = (params: { id: IDModel; data: UpdateUserRequestModel }) => {
        const _req = $apiMulti.users.update(params)

        _req.then((res) => {
            setUser(res.data)
        })

        return _req
    }

    const add = (body: CreateUserRequestModel) => {
        return $apiMulti.users.store(body)
    }

    const deactivate = (id: IDModel) => {
        return $apiMulti.users.deactivate(id)
    }

    const inviteSend = (id: IDModel) => {
        return $apiMulti.users.inviteSend(id)
    }

    const inviteValidate = (params: { id: IDModel; data: InviteValidateRequestModel }) => {
        return $apiMulti.users.inviteValidate(params)
    }

    const inviteConsume = (params: { id: IDModel; data: InviteConsumeRequestModel }) => {
        return $apiMulti.users.inviteConsume(params)
    }

    return {
        userState,
        resetState,
        setUsers,
        setUser,
        index,
        show,
        update,
        add,
        deactivate,
        inviteSend,
        inviteValidate,
        inviteConsume,
    }
})

export type useUsersStore = ReturnType<typeof useUsersStore>
