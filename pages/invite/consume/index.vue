<template>
    <b-col lg="6" md="9">
        <logo class="pb-5" />
        <b-card body-class="p-6">
            <template v-if="showError">
                <b-alert show variant="danger">
                    Some information is missing. Please make sure you copy the whole URL.
                </b-alert>
            </template>
            <template v-else>
                <h3 class="text-center font-weight-light mb-6">Accept Invite</h3>
                <error-alert />
                <b-form @submit="tryToSubmitForm">
                    <client-only placeholder="Loading...">
                        <label class="d-block">PASSWORD:</label>
                        <weavr-password-input
                            ref="passwordField"
                            :base-style="passwordBaseStyle"
                            :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
                            class-name="sign-in-password"
                            name="password"
                            required="true"
                            @onChange="passwordInteraction"
                            @onKeyUp="checkOnKeyUp"
                            @onStrength="strengthCheck"
                        />
                        <small
                            :class="!isPasswordValidAndDirty ? 'text-danger' : 'text-muted'"
                            class="form-text mb-3"
                            >- min 8 characters <br />- uppercase letter <br />- digit and a special
                            character</small
                        >
                    </client-only>
                    <b-form-row class="mt-6">
                        <b-col class="text-center">
                            <b-button
                                :disabled="$fetchState.pending"
                                type="submit"
                                variant="secondary"
                            >
                                submit
                                <span class="pl-5">-></span>
                            </b-button>
                        </b-col>
                    </b-form-row>
                </b-form>
            </template>
        </b-card>
    </b-col>
</template>
<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'
import Logo from '~/components/Logo.vue'

@Component({
    layout: 'auth',
    validations: {
        inviteForm: {
            password: {
                required,
            },
        },
    },
    components: {
        Logo,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
        WeavrPasswordInput,
    },
})
export default class IniteConsume extends mixins(BaseMixin) {
    showError = false
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    passwordStrength = 0
    protected form!: { id: IDModel; data: InviteConsumeRequestModel }
    private inviteForm = {
        password: {
            value: '',
        },
    }

    get isPasswordValidAndDirty() {
        return !this.$v.inviteForm.password?.$dirty ? true : this.isPasswordValid
    }

    get isPasswordValid(): boolean {
        return this.passwordStrength >= 2
    }

    get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
        return {
            color: '#495057',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            fontFamily: "'Be Vietnam', sans-serif",
            fontWeight: '400',
            lineHeight: '24px',
            margin: '0',
            padding: '6px 12px',
            textIndent: '0px',
            '::placeholder': {
                color: '#B6B9C7',
                fontWeight: '400',
            },
        }
    }

    asyncData({ route }) {
        try {
            const _consumeInviteRequest: { id: IDModel; data: InviteConsumeRequestModel } = {
                id: route.query.user_id.toString(),
                data: {
                    inviteCode: route.query.nonce.toString(),
                    password: {
                        value: '',
                    },
                },
            }

            return {
                form: _consumeInviteRequest,
                showError: false,
            }
        } catch (e) {
            return {
                showError: true,
            }
        }
    }

    fetch() {
        try {
            const _validateRequest: { id: IDModel; data: InviteValidateRequestModel } = {
                id: this.$route.query.user_id.toString(),
                data: {
                    inviteCode: this.$route.query.nonce.toString(),
                },
            }

            return this.usersStore.inviteValidate(_validateRequest).catch(this.handleError)
        } catch (e) {}
    }

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.inviteForm.password.value = '******')
            : (this.inviteForm.password.value = '')
        this.$v.inviteForm.password?.$touch()
    }

    handleError(e) {
        this.stores.errors.SET_ERROR(e.response)
    }

    tryToSubmitForm(e) {
        e.preventDefault()
        if (this.isPasswordValid) {
            this.passwordField.createToken().then(
                (tokens) => {
                    if (tokens.tokens.password !== '') {
                        this.form.data.password!.value = tokens.tokens.password
                        this.usersStore.inviteConsume(this.form).then(() => {
                            this.$router.push('/login')
                        })
                    } else {
                        return null
                    }
                },
                () => {
                    return null
                },
            )
        }
    }

    checkOnKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.tryToSubmitForm(e)
        }
    }
}
</script>
