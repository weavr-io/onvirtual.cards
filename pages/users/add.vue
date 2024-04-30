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
                    <b-form @submit="doAdd">
                        <b-form-row>
                            <b-col>
                                <b-form-group label="Name*">
                                    <b-form-input
                                        v-model="$v.request.name.$model"
                                        :state="isInvalid($v.request.name)"
                                    />
                                    <b-form-invalid-feedback
                                        >This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group label="Surname*">
                                    <b-form-input
                                        v-model="$v.request.surname.$model"
                                        :state="isInvalid($v.request.surname)"
                                    />
                                    <b-form-invalid-feedback
                                        >This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group label="Email*">
                                    <b-form-input
                                        v-model="$v.request.email.$model"
                                        :state="isInvalid($v.request.email)"
                                        lazy
                                        type="email"
                                    />
                                    <b-form-invalid-feedback
                                        >This field is required and must be a valid email.
                                    </b-form-invalid-feedback>
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
import { Component, mixins } from 'nuxt-property-decorator'
import { email, maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'
import LoaderButton from '~/components/atoms/LoaderButton.vue'

// @TODO[JOSHUA] - REFACTOR TO ZOD

@Component({
    components: {
        LoaderButton,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
    validations: {
        request: {
            name: {
                required,
                maxLength: maxLength(100),
            },
            surname: {
                required,
                maxLength: maxLength(100),
            },
            email: {
                required,
                email,
            },
        },
    },
    middleware: ['kyVerified'],
})
export default class AddCardPage extends mixins(BaseMixin, ValidationMixin) {
    isLoading = false

    request: Nullable<CreateUserRequestModel> = {
        name: null,
        surname: null,
        email: null,
        mobile: null,
        dateOfBirth: null,
    }

    async doAdd(evt) {
        evt.preventDefault()

        if (this.$v.request) {
            this.$v.request.$touch()
            if (this.$v.request.$anyError) {
                return null
            }
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
