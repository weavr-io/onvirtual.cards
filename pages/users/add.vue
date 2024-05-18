<template>
    <section>
        <b-container>
            <b-row>
                <b-col>
                    <h2 class="text-center font-weight-lighter mb-5">Invite User</h2>
                </b-col>
            </b-row>
            <b-row align-h="center">
                <b-col lg="6" md="9">
                    <error-alert />
                    <b-form @submit.prevent="doAdd">
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('name')"
                                    :state="validation.getState('name')"
                                    label="Name*"
                                >
                                    <b-form-input v-model="request.name" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('surname')"
                                    :state="validation.getState('surname')"
                                    label="Surname*"
                                >
                                    <b-form-input v-model="request.surname" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('email')"
                                    :state="validation.getState('email')"
                                    label="Email*"
                                >
                                    <b-form-input v-model="request.email" lazy type="email" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <LoaderButton
                            :is-loading="isLoading"
                            class="mt-5 text-center"
                            text="send invite"
                        />
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins } from 'nuxt-property-decorator'
import {
    CreateUserRequestModel,
    INITIAL_USER_REQUEST,
    type UserRequest,
    UserSchema,
} from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import BaseMixin from '~/mixins/BaseMixin'

import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        LoaderButton,
        ErrorAlert: () => import('~/components/molecules/ErrorAlert.vue'),
    },
    middleware: ['kyVerified'],
})
export default class AddCardPage extends mixins(BaseMixin) {
    isLoading = false

    request: UserRequest = reactive(INITIAL_USER_REQUEST())

    get validation() {
        return useZodValidation(UserSchema, this.request)
    }

    async doAdd() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) {
            return null
        }

        this.isLoading = true

        await this.usersStore
            .add(this.request as CreateUserRequestModel)
            .then((res) => {
                this.userAdded(res.data)
            })
            .catch((err) => {
                this.errorsStore.setError(err)
                this.isLoading = false
            })
    }

    async userAdded(res: UserModel) {
        await this.usersStore.inviteSend(res.id)
        await this.$router.push('/users')
        this.isLoading = false
    }
}
</script>
