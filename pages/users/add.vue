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
                                    label="Name*"
                                    :state="validation.getState('name')"
                                    :invalid-feedback="validation.getInvalidFeedback('name')"
                                >
                                    <b-form-input v-model="request.name" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    label="Surname*"
                                    :state="validation.getState('surname')"
                                    :invalid-feedback="validation.getInvalidFeedback('surname')"
                                >
                                    <b-form-input v-model="request.surname" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    label="Email*"
                                    :state="validation.getState('email')"
                                    :invalid-feedback="validation.getInvalidFeedback('email')"
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
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import {
    type UserRequest,
    UserSchema,
    INITIAL_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        LoaderButton,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
    middleware: ['kyVerified'],
})
export default class AddCardPage extends mixins(BaseMixin, ValidationMixin) {
    isLoading = false

    request: UserRequest = reactive(INITIAL_USER_REQUEST)

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
