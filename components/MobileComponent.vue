<template>
    <div class="mb-5">
        <b-card class="px-4 py-5 p-md-card">
            <h3 class="font-weight-light text-center">
                <slot name="title"></slot>
            </h3>
            <b-row align-h="center">
                <b-col md="6" class="text-center">
                    <b-img fluid src="/img/mobile.svg" class="mt-5 mb-2" />
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
                            :state="isInvalid($v.request.verificationCode)"
                            invalid-feedback="This field is required and must be 6 characters"
                        >
                            <b-form-input
                                v-model="$v.request.verificationCode.$model"
                                lazy
                                placeholder="000000"
                                class="text-center"
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
                            href="https://support.weavr.io/support/login"
                            class="text-primary text-decoration-none"
                            target="_blank"
                            >customer support</a
                        >
                        if you have difficulties signing in.
                    </small>
                </div>
                <loader-button
                    :is-loading="isLoading"
                    button-text="verify"
                    class="mt-4 text-center mb-0"
                />
            </form>
            <div v-if="verifyPhone">
                <b-alert
                    :show="dismissCountDown"
                    variant="white"
                    class="text-center mt-4 mb-0 text-muted small"
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
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/LoaderButton.vue'

@Component({
    layout: 'auth',
    components: {
        ErrorAlert,
        LoaderButton,
    },
    validations: {
        request: {
            verificationCode: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(6),
            },
        },
    },
})
export default class MobileComponent extends mixins(BaseMixin, ValidationMixin) {
    @Prop() readonly verifyPhone!: boolean

    isLoading = false

    request: Nullable<AuthVerifyEnrolRequest> = {
        verificationCode: null,
    }

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
            await this.stores.auth
                .enrollAuthFactors(SCAOtpChannelEnum.SMS)
                .finally(() => (this.isLoading = false))
        } else {
            await this.stores.auth
                .enrollStepUp(SCAOtpChannelEnum.SMS)
                .then(() => localStorage.setItem('scaSmsSent', 'TRUE'))
                .finally(() => (this.isLoading = false))
        }
    }

    async doVerify() {
        this.$v.$touch()

        if (this.$v.$invalid) {
            return
        }

        this.isLoading = true

        const req: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest } = {
            channel: SCAOtpChannelEnum.SMS,
            body: this.request as AuthVerifyEnrolRequest,
        }

        try {
            if (this.verifyPhone) {
                await this.stores.auth
                    .verifyAuthFactors(req)
                    .then(() => {
                        this.stores.identities.SET_MOBILE_VERIFIED(true)
                        this.getConsumersOrCorporates()
                    })
                    .finally(() => {
                        this.isLoading = false
                    })
                await this.stores.auth.indexAuthFactors()
                await this.$router.push({
                    path: '/login/sca',
                    query: {
                        send: 'true',
                    },
                })
            } else {
                await this.stores.auth
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
        } catch (e) {}
    }

    getConsumersOrCorporates() {
        return this.isConsumer ? this.stores.consumers.get() : this.stores.corporates.get()
    }

    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    showAlert() {
        this.dismissCountDown = this.dismissSecs
    }
}
</script>
