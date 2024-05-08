<template>
    <div class="mb-5">
        <b-card class="px-4 py-5 p-md-card">
            <h3 class="font-weight-light text-center">
                <slot name="title"></slot>
            </h3>
            <b-row align-h="center">
                <b-col class="text-center" md="6">
                    <b-img class="mt-5 mb-2" fluid src="/img/mobile.svg" />
                </b-col>
            </b-row>

            <form id="form-verify" class="mt-5" @submit.prevent="doVerify">
                <b-alert :show="showSmsResentSuccess" variant="success">
                    <slot name="alert"></slot>
                </b-alert>
                <p class="text-center my-5 text-grey">
                    <slot name="description"></slot>
                </p>
                <error-alert class="mt-3" />
                <b-row align-h="center">
                    <b-col cols="6">
                        <b-form-group
                            :invalid-feedback="validation.getInvalidFeedback('verificationCode')"
                            :state="validation.getState('verificationCode')"
                        >
                            <b-form-input
                                v-model="request.verificationCode"
                                class="text-center"
                                lazy
                                placeholder="000000"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
                <div class="text-center mt-3 text-grey font-italic">
                    <small v-if="verifyPhone">
                        Once this step is complete, we will send you another SMS that should be used
                        for login on the next screen.
                    </small>
                    <small v-else>
                        Please contact our
                        <a
                            class="text-primary text-decoration-none"
                            href="https://support.weavr.io/support/login"
                            target="_blank"
                            >customer support</a
                        >
                        if you have difficulties signing in.
                    </small>
                </div>
                <LoaderButton :is-loading="isLoading" class="mt-4 text-center mb-0" text="verify" />
            </form>
            <div v-if="verifyPhone">
                <b-alert
                    :show="dismissCountDown"
                    class="text-center mt-4 mb-0 text-muted small"
                    variant="white"
                    @dismiss-count-down="countDownChanged"
                >
                    {{ dismissCountDown }}
                    <slot name="countdown"></slot>
                </b-alert>
                <div v-if="!dismissCountDown" class="mt-4 text-center">
                    <small class="text-grey">
                        Didn’t receive a code?
                        <b-link class="text-decoration-underline text-grey" @click="resendSms"
                            >Send again
                        </b-link>
                        .
                    </small>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import BaseMixin from '~/mixins/BaseMixin'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'

import ValidationMixin from '~/mixins/ValidationMixin'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import {
    AuthVerifyEnrol,
    AuthVerifyEnrolSchema,
    INITIAL_AUTH_VERIFY_REQUEST,
} from '~/plugins/weavr-multi/api/models/authentication/additional-factors'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        ErrorAlert,
        LoaderButton,
    },
})
export default class MobileComponent extends mixins(BaseMixin, ValidationMixin) {
    @Prop() readonly verifyPhone!: boolean

    isLoading = false

    request: AuthVerifyEnrol = reactive(INITIAL_AUTH_VERIFY_REQUEST())
    validation = useZodValidation(AuthVerifyEnrolSchema, this.request)

    showSmsResentSuccess = false
    dismissSecs = 60
    dismissCountDown = 0

    mounted() {
        if (
            this.$route.query.send === 'true' &&
            (this.verifyPhone || localStorage.getItem('scaSmsSent') === 'FALSE')
        ) {
            this.sendSms()
        }
    }

    resendSms() {
        this.sendSms().then(() => {
            this.showSmsResentSuccess = true
        })
    }

    async sendSms() {
        this.showAlert()
        this.isLoading = true
        if (this.verifyPhone) {
            await this.authStore
                .enrollAuthFactors(SCAOtpChannelEnum.SMS)
                .finally(() => (this.isLoading = false))
        } else {
            await this.authStore
                .enrollStepUp(SCAOtpChannelEnum.SMS)
                .then(() => localStorage.setItem('scaSmsSent', 'TRUE'))
                .finally(() => (this.isLoading = false))
        }
    }

    async doVerify() {
        this.isLoading = true
        await this.validation.validate()

        if (this.validation.isInvalid) {
            this.isLoading = false
            return
        }

        const req: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol } = {
            channel: SCAOtpChannelEnum.SMS,
            body: this.request,
        }

        try {
            if (this.verifyPhone) {
                await this.authStore
                    .verifyAuthFactors(req)
                    .then(() => {
                        this.identityStore.setMobileVerified(true)
                        this.getConsumersOrCorporates()
                    })
                    .finally(() => {
                        this.isLoading = false
                    })
                await this.authStore.indexAuthFactors()
                await this.$router.push({
                    path: '/login/sca',
                    query: {
                        send: 'true',
                    },
                })
            } else {
                await this.authStore
                    .verifyStepUp(req)
                    .then(() => {
                        localStorage.setItem('stepUp', 'TRUE')
                        this.getConsumersOrCorporates()
                        this.goToIndex()
                    })
                    .finally(() => {
                        this.isLoading = false
                    })
            }
        } catch (e) {
            this.isLoading = false
        }
    }

    getConsumersOrCorporates() {
        return this.isConsumer ? this.consumersStore.get() : this.corporatesStore.get()
    }

    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    showAlert() {
        this.dismissCountDown = this.dismissSecs
    }
}
</script>
