<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <div class="mb-5">
            <b-card class="px-4 py-5 p-md-card">
                <h3 class="font-weight-light text-center">Check your inbox!</h3>
                <b-row align-h="center">
                    <b-col class="text-center" md="6">
                        <b-img class="mt-5 mb-2" fluid src="/img/email.svg" />
                    </b-col>
                </b-row>
                <form id="contact-form" class="mt-5" @submit.prevent="doVerify">
                    <b-alert :show="showEmailResentSuccess" variant="success">
                        The verification code was resent by email.
                    </b-alert>
                    <p class="text-center mb-5 text-grey">
                        We’ve just sent you a verification code by email. Enter code below to verify
                        your email address.
                    </p>
                    <error-alert class="mt-3" />
                    <b-row align-h="center">
                        <b-col cols="6">
                            <b-form-group
                                :state="isInvalid($v.verifyEmailRequest.verificationCode)"
                                invalid-feedback="This field is required and must be 6 characters"
                            >
                                <b-form-input
                                    v-model="$v.verifyEmailRequest.verificationCode.$model"
                                    class="text-center"
                                    lazy
                                    placeholder="000000"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <LoaderButton :is-loading="isLoading" class="mt-5 text-center" text="verify" />
                </form>
                <div class="mt-4 text-center">
                    <small class="text-grey">
                        Didn’t receive a code?
                        <b-link class="text-decoration-underline text-grey" @click="resendEmail"
                            >Send again
                        </b-link>
                        .
                    </small>
                </div>
            </b-card>
        </div>
    </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import ValidationMixin from '~/mixins/ValidationMixin'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/CredentialTypeEnum'
import LogoOvc from '~/components/atoms/LogoOvc.vue'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LoaderButton from '~/components/atoms/LoaderButton.vue'

@Component({
    layout: 'auth',
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
    validations: {
        verifyEmailRequest: {
            verificationCode: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(6),
            },
        },
    },
})
export default class EmailVerificationPage extends mixins(BaseMixin, ValidationMixin) {
    showEmailResentSuccess = false
    isLoading = false
    private verifyEmailRequest!: VerifyEmailRequest

    async asyncData({ route, redirect }) {
        const { auth, identity, consumers, corporates } = initialiseStores([
            'auth',
            'identity',
            'consumers',
            'corporates',
        ])

        if (identity?.identityState.identity === null) {
            await identity?.getIdentity()
        }

        if (
            identity?.identityState.emailVerified ||
            auth?.authState.auth?.credentials.type === CredentialTypeEnum.USER
        ) {
            return redirect('/login/verify/mobile')
        }

        const request: VerifyEmailRequest = {
            email: route.query.email ?? identity?.identityState.identity!.rootUser?.email,
            verificationCode: route.query.nonce ? `${route.query.nonce}` : '',
        }

        if (request.verificationCode !== '') {
            if (route.query.cons) {
                consumers?.verifyEmail(request).then(() => {
                    redirect('/')
                })
            } else {
                // else treat as Corporate
                corporates?.verifyEmail(request).then(() => {
                    if (auth?.isLoggedIn) {
                        redirect('/')
                    } else {
                        redirect('/login')
                    }
                })
            }
        }

        return {
            verifyEmailRequest: request,
        }
    }

    async mounted() {
        if (this.$route.query.send === 'true') {
            await this.sendVerifyEmail()
        }
    }

    async sendVerifyEmail() {
        this.isLoading = true

        if (this.$route.query.cons) {
            await this.sendVerifyEmailConsumers().catch()
        } else {
            // else treat as corporate
            await this.sendVerifyEmailCorporates().catch()
        }

        this.isLoading = false
    }

    async sendVerifyEmailConsumers() {
        await this.consumersStore.sendVerificationCodeEmail({
            email: this.verifyEmailRequest.email,
        })
    }

    async sendVerifyEmailCorporates() {
        await this.corporatesStore.sendVerificationCodeEmail({
            email: this.verifyEmailRequest.email,
        })
    }

    resendEmail() {
        this.sendVerifyEmail()
            .then(() => {
                this.showEmailResentSuccess = true
            })
            .catch(() => {
                this.isLoading = false
            })
    }

    doVerify() {
        this.$v.$touch()

        if (this.$v.$invalid) {
            return
        }

        this.isLoading = true

        this.$route.query.cons
            ? this.consumersStore
                  .verifyEmail(this.verifyEmailRequest)
                  .then(this.onMobileVerified)
                  .catch((e) => {
                      this.removeLoader()
                      this.errorsStore.setConflict(e)
                  })
            : this.corporatesStore
                  .verifyEmail(this.verifyEmailRequest)
                  .then(this.onMobileVerified)
                  .catch((e) => {
                      this.removeLoader()
                      this.errorsStore.setConflict(e)
                  })
    }

    removeLoader() {
        this.isLoading = false
    }

    onMobileVerified() {
        this.identityStore.setEmailVerified(true)

        return this.$router.push({
            path: '/login/verify/mobile',
            query: {
                send: 'true',
                cons: this.$route.query.cons,
                corp: this.$route.query.corp,
                mobileNumber: this.$route.query.mobileNumber,
                mobileCountryCode: this.$route.query.mobileCountryCode,
            },
        })
    }
}
</script>
