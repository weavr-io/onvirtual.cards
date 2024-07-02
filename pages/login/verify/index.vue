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
import {
    computed,
    defineComponent,
    ref,
    useAsync,
    useFetch,
    useRoute,
    useRouter,
} from '@nuxtjs/composition-api'
import { reactive } from 'vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import {
    CredentialTypeEnum,
    INITIAL_VERIFY_EMAIL_REQUEST,
    VerifyEmail,
    VerifyEmailSchema,
} from '~/plugins/weavr-multi/api/models/common'
import useZodValidation from '~/composables/useZodValidation'
import { useStores } from '~/composables/useStores'

export default defineComponent({
    components: {
        LogoOvc,
        LoaderButton,
        ErrorAlert,
    },
    layout: 'auth',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const { auth, identity, consumers, corporates, errors } = useStores([
            'auth',
            'identity',
            'consumers',
            'corporates',
            'errors',
        ])

        const showEmailResentSuccess = ref(false)
        const isLoading = ref(false)
        let verifyEmailRequest = reactive(INITIAL_VERIFY_EMAIL_REQUEST())

        const validation = computed(() => {
            return useZodValidation(
                VerifyEmailSchema.pick({ verificationCode: true }),
                verifyEmailRequest,
            )
        })

        useAsync(async () => {
            if (identity?.identityState.identity === null) {
                await identity?.getIdentity()
            }

            if (
                identity?.identityState.emailVerified ||
                auth?.authState.auth?.credentials.type === CredentialTypeEnum.USER
            ) {
                return router.push('/login/verify/mobile')
            }

            const request: VerifyEmail = {
                email: route.value.query.email ?? identity?.identityState.identity!.rootUser?.email,
                verificationCode: route.value.query.nonce
                    ? `${route.value.query.nonce}`
                    : undefined,
            }

            try {
                if (request.verificationCode !== undefined) {
                    if (route.value.query.cons) {
                        await consumers?.verifyEmail(request).then(() => {
                            router.push('/')
                        })
                    } else {
                        // else treat as Corporate
                        await corporates?.verifyEmail(request).then(() => {
                            if (auth?.isLoggedIn) {
                                router.push('/')
                            } else {
                                router.push('/login')
                            }
                        })
                    }
                }
            } catch (e) {}

            verifyEmailRequest = request
        })

        useFetch(async () => {
            if (route.value.query.send === 'true') {
                await sendVerifyEmail()
            }
        })

        const sendVerifyEmail = async () => {
            isLoading.value = true

            try {
                if (route.value.query.cons) {
                    await sendVerifyEmailConsumers()
                } else {
                    // else treat as corporate
                    await sendVerifyEmailCorporates()
                }
            } catch (e) {}

            removeLoader()
        }

        const sendVerifyEmailConsumers = async () => {
            await consumers?.sendVerificationCodeEmail({
                email: verifyEmailRequest.email,
            })
        }

        const sendVerifyEmailCorporates = async () => {
            await corporates?.sendVerificationCodeEmail({
                email: verifyEmailRequest.email,
            })
        }

        const resendEmail = async () => {
            await sendVerifyEmail()
                .then(() => {
                    showEmailResentSuccess.value = true
                })
                .catch(() => {
                    removeLoader()
                })
        }

        const removeLoader = () => {
            isLoading.value = false
        }

        const doVerify = async () => {
            isLoading.value = true
            await validation.value.validate()

            if (validation.value.isInvalid.value) {
                removeLoader()
                return
            }

            route.value.query.cons
                ? await consumers
                      ?.verifyEmail(verifyEmailRequest)
                      .then(onEmailVerified)
                      .catch((e) => {
                          removeLoader()
                          errors?.setConflict(e)
                      })
                : await corporates
                      ?.verifyEmail(verifyEmailRequest)
                      .then(onEmailVerified)
                      .catch((e) => {
                          removeLoader()
                          errors?.setConflict(e)
                      })
        }

        const onEmailVerified = () => {
            identity?.setEmailVerified(true)
            return router.push({
                path: '/login/verify/mobile',
                query: {
                    send: 'true',
                    cons: route.value.query.cons,
                    corp: route.value.query.corp,
                    mobileNumber: route.value.query.mobileNumber,
                    mobileCountryCode: route.value.query.mobileCountryCode,
                },
            })
        }

        return {
            doVerify,
            showEmailResentSuccess,
            validation,
            verifyEmailRequest,
            isLoading,
            resendEmail,
        }
    },
})
</script>
