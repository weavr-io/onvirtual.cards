<template>
    <b-col lg="6" md="9">
        <LogoOvc classes="mb-5" />
        <b-card body-class="p-6">
            <template v-if="showError">
                <b-alert show variant="danger">
                    Some information is missing. Please make sure you copy the whole URL.
                </b-alert>
            </template>
            <template v-else>
                <h3 class="text-center font-weight-light mb-6">Accept Invite</h3>
                <error-alert />
                <b-form @submit.prevent="tryToSubmitForm">
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
import { reactive } from 'vue'
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'
import BaseMixin from '~/mixins/BaseMixin'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import useZodValidation from '~/composables/useZodValidation'
import {
    INITIAL_PASSWORD_REQUEST,
    PasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access'

@Component({
    layout: 'auth',
    components: {
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        WeavrPasswordInput,
    },
})
export default class IniteConsume extends mixins(BaseMixin) {
    showError = false

    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    passwordStrength = 0
    inviteForm = reactive(INITIAL_PASSWORD_REQUEST())

    protected form!: { id: IDModel; data: InviteConsumeRequestModel }

    get validation() {
        return useZodValidation(PasswordSchema, this.inviteForm)
    }

    get isPasswordValidAndDirty() {
        return !this.inviteForm.password?.value ? true : this.isPasswordValid
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
        } catch (_) {
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
        } catch (_) {}
    }

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.inviteForm.password.value = '******')
            : (this.inviteForm.password.value = '')
        this.validation.validate()
    }

    handleError(e) {
        this.errorsStore.setError(e.response)
    }

    tryToSubmitForm() {
        if (this.isPasswordValid && this.validation.isValid) {
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
            this.tryToSubmitForm()
        }
    }
}
</script>

<!--<script lang="ts">-->
<!--import { defineComponent, ref } from '@nuxtjs/composition-api'-->
<!--import LogoOvc from '~/components/molecules/LogoOvc.vue'-->
<!--import ErrorAlert from '~/components/molecules/ErrorAlert.vue'-->
<!--import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'-->
<!--import { reactive } from 'vue'-->
<!--import { required } from 'vuelidate/lib/validators'-->
<!--import Vuelidate from 'vuelidate'-->

<!--export default defineComponent({-->
<!--    layout: 'auth',-->
<!--    components: {-->
<!--        LogoOvc,-->
<!--        ErrorAlert,-->
<!--        WeavrPasswordInput,-->
<!--    },-->
<!--    setup() {-->
<!--        const showError = ref(false)-->
<!--        const passwordField: WeavrPasswordInput | null = ref(null)-->
<!--        const passwordStrength = ref(0)-->

<!--        const state = reactive({-->
<!--            inviteForm: {-->
<!--                password: '',-->
<!--            },-->
<!--        })-->

<!--        const rules = {-->
<!--            inviteForm: {-->
<!--                password: { required }, // Matches state.contact.email-->
<!--            },-->
<!--        }-->

<!--        // const v$ = Vuelidate(rules, state)-->
<!--    }-->
<!--})-->
<!--</script>-->
