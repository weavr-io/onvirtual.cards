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
                        <loader-button
                            :is-loading="isLoading"
                            button-text="send invite"
                            class="mt-5 text-center"
                        />
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { email, maxLength, required } from 'vuelidate/lib/validators'
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import { Nullable } from '~/global'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'

const Cookie = process.client ? require('js-cookie') : undefined

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
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

    doAdd() {
        if (this.$v.request) {
            this.$v.request.$touch()
            if (this.$v.request.$anyError) {
                return
            }
        }

        this.isLoading = true

        this.sendRequest(this.request as CreateUserRequestModel)
    }

    sendRequest(request: CreateUserRequestModel) {
        return this.stores.users
            .add(request)
            .then((res) => {
                this.userAdded(res.data)
                Cookie.remove('user-invite')
            })
            .catch((err) => {
                if (parseInt(err.response && err.response.status) === 403) {
                    Cookie.set('user-invite', JSON.stringify(this.request))
                }

                this.stores.errors.SET_ERROR(err)
                this.isLoading = false
            })
    }

    async userAdded(res: UserModel) {
        await this.stores.users.inviteSend(res.id)
        await this.$router.push('/users')
        this.isLoading = false
    }

    @Watch('$route.query.invite', { immediate: true })
    onInvited(status: string) {
        if (status === 'true') {
            const userInvite = Cookie.get('user-invite')
            if (userInvite) {
                try {
                    const invite = JSON.parse(userInvite)
                    this.sendRequest(invite as CreateUserRequestModel)
                } catch (_) {
                    // No valid cookie found
                }
            }
        }
    }
}
</script>
