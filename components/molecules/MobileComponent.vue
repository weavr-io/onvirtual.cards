<template>
    <div class="mb-5">
        <b-card class="px-4 py-5 p-md-card">
            <h3 class="fw-light text-center">
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
                            class="mb-3"
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
                <div class="text-center mt-3 text-grey fst-italic">
                    <small v-if="props.verifyPhone">
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
            <div v-if="props.verifyPhone">
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

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import { useBase } from '~/composables/useBase'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import {
    type AuthVerifyEnrol,
    AuthVerifyEnrolSchema,
    INITIAL_AUTH_VERIFY_REQUEST,
} from '~/plugins/weavr-multi/api/models/authentication/additional-factors'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

definePageMeta({
    layout: 'auth',
})

const props = defineProps({
    verifyPhone: {
        type: Boolean,
        required: true,
    },
})

const { auth, consumers, corporates, identity } = useStores([
    'auth',
    'identity',
    'consumers',
    'corporates',
])
const { isConsumer, goToIndex } = useBase()

const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(false)
const request = reactive<AuthVerifyEnrol>(INITIAL_AUTH_VERIFY_REQUEST())
const showSmsResentSuccess = ref<boolean>(false)
const dismissSecs = ref<number>(60)
const dismissCountDown = ref<number | boolean>(0)
const validation = computed(() => useZodValidation(AuthVerifyEnrolSchema, request))

const showAlert = () => {
    dismissCountDown.value = dismissSecs.value
}

const sendSms = async () => {
    showAlert()
    isLoading.value = true
    if (props.verifyPhone) {
        await auth
            ?.enrollAuthFactors(SCAOtpChannelEnum.SMS)
            .finally(() => (isLoading.value = false))
    } else {
        await auth
            ?.enrollStepUp(SCAOtpChannelEnum.SMS)
            .then(() => localStorage.setItem('scaSmsSent', 'TRUE'))
            .finally(() => (isLoading.value = false))
    }
}

useAsyncData(async () => {
    if (
        route.query.send === 'true' &&
        (props.verifyPhone || localStorage.getItem('scaSmsSent') === 'FALSE')
    ) {
        await sendSms()
    }
})

const resendSms = () => {
    sendSms().then(() => {
        showSmsResentSuccess.value = true
    })
}

const getConsumersOrCorporates = () => {
    isConsumer.value ? consumers?.get() : corporates?.get()
}

const countDownChanged = (countDown: number) => {
    dismissCountDown.value = countDown
}

const doVerify = async () => {
    isLoading.value = true
    await validation.value.validate()

    if (validation.value.isInvalid.value) {
        isLoading.value = false
        return
    }

    const req: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol } = {
        channel: SCAOtpChannelEnum.SMS,
        body: request,
    }

    try {
        if (props.verifyPhone) {
            await auth
                ?.verifyAuthFactors(req)
                .then(() => {
                    identity?.setMobileVerified(true)
                    getConsumersOrCorporates()
                })
                .finally(() => {
                    isLoading.value = false
                })
            await auth?.indexAuthFactors()
            await router.push({
                path: '/login/sca',
                query: {
                    send: 'true',
                },
            })
        } else {
            await auth
                ?.verifyStepUp(req)
                .then(() => {
                    localStorage.setItem('stepUp', 'TRUE')
                    getConsumersOrCorporates()
                    goToIndex()
                })
                .finally(() => {
                    isLoading.value = false
                })
        }
    } catch (_) {
        isLoading.value = false
    }
}
</script>
