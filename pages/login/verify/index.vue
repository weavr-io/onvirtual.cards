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
                                :invalid-feedback="
                                    validation.getInvalidFeedback('verificationCode')
                                "
                                :state="validation.getState('verificationCode')"
                            >
                                <b-form-input
                                    v-model="verifyEmailRequest.verificationCode"
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
import BaseMixin from '~/mixins/BaseMixin'
import {
    VerifyEmail,
    VerifyEmailSchema,
} from '~/plugins/weavr-multi/api/models/common/models/VerifyEmail'

import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/CredentialTypeEnum'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
})
export default class EmailVerificationPage extends mixins(BaseMixin) {
    showEmailResentSuccess = false
    isLoading = false

    verifyEmailRequest!: VerifyEmail

    get validation() {
        return useZodValidation(
            VerifyEmailSchema.pick({ verificationCode: true }),
            this.verifyEmailRequest,
        )
    }

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

        const request: VerifyEmail = {
            email: route.query.email ?? identity?.identityState.identity!.rootUser?.email,
            verificationCode: route.query.nonce ? `${route.query.nonce}` : undefined,
        }

        try {
            if (request.verificationCode !== undefined) {
                if (route.query.cons) {
                    await consumers?.verifyEmail(request).then(() => {
                        redirect('/')
                    })
                } else {
                    // else treat as Corporate
                    await corporates?.verifyEmail(request).then(() => {
                        if (auth?.isLoggedIn) {
                            redirect('/')
                        } else {
                            redirect('/login')
                        }
                    })
                }
            }
        } catch (e) {}

        return {
            verifyEmailRequest: request,
        }
    }

    async fetch() {
        if (this.$route.query.send === 'true') {
            await this.sendVerifyEmail()
        }
    }

    async sendVerifyEmail() {
        this.isLoading = true

        try {
            if (this.$route.query.cons) {
                await this.sendVerifyEmailConsumers()
            } else {
                // else treat as corporate
                await this.sendVerifyEmailCorporates()
            }
        } catch (e) {}

        this.removeLoader()
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
                this.removeLoader()
            })
    }

    async doVerify() {
        this.isLoading = true
        await this.validation.validate()

        if (this.validation.isInvalid.value) {
            this.removeLoader()
            return
        }

        this.$route.query.cons
            ? await this.consumersStore
                  .verifyEmail(this.verifyEmailRequest)
                  .then(this.onEmailVerified)
                  .catch((e) => {
                      this.removeLoader()
                      this.errorsStore.setConflict(e)
                  })
            : await this.corporatesStore
                  .verifyEmail(this.verifyEmailRequest)
                  .then(this.onEmailVerified)
                  .catch((e) => {
                      this.removeLoader()
                      this.errorsStore.setConflict(e)
                  })
    }

    removeLoader() {
        this.isLoading = false
    }

    onEmailVerified() {
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
