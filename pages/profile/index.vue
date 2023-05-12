<template>
    <section class="py-5">
        <b-container>
            <b-row align-h="center">
                <b-col md="6">
                    <b-form @submit.prevent="doUpdateIdentityRoot">
                        <error-alert />
                        <b-form-row>
                            <b-col>
                                <b-form-group label="FIRST NAME">
                                    <b-form-input
                                        :value="base.unRefs.rootName"
                                        class="form-control"
                                        disabled
                                        placeholder="John"
                                        readonly
                                    />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="LAST NAME">
                                    <b-form-input
                                        :value="base.unRefs.rootSurname"
                                        class="form-control"
                                        disabled
                                        placeholder="Doe"
                                        readonly
                                    />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.invalidFeedback(
                                            $v.updateIdentityRootUser.email,
                                            validation.validateVParams(
                                                $v.updateIdentityRootUser.email.$params,
                                                $v.updateIdentityRootUser.email
                                            )
                                        )
                                    "
                                    :state="validation.isInvalid($v.updateIdentityRootUser.email)"
                                    label="E-Mail"
                                >
                                    <b-form-input
                                        v-model="$v.updateIdentityRootUser.email.$model"
                                        :disabled="isEmailVerified"
                                        class="form-control"
                                        placeholder="example@email.com"
                                    />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group label="MOBILE NUMBER">
                                    <vue-phone-number-input
                                        :border-radius="0"
                                        :default-country-code="mobile.countryCode"
                                        :disabled="isMobileVerified"
                                        :error="numberIsValid === false"
                                        :value="mobile.number"
                                        color="#6C1C5C"
                                        error-color="#F50E4C"
                                        valid-color="#6D7490"
                                        @update="phoneUpdate"
                                    />
                                    <b-form-invalid-feedback
                                        v-if="numberIsValid === false"
                                        force-show
                                    >
                                        This field must be a valid mobile number.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <div class="small text-center my-5">
                            If you are already verified and need to update your email or mobile
                            number please contact
                            <a href="mailto: support@onvirtual.cards">support@onvirtual.cards</a>.
                        </div>
                        <b-form-row class="my-4">
                            <b-col class="text-center">
                                <b-link class="link" to="/profile/password/change">
                                    Change password
                                </b-link>
                            </b-col>
                        </b-form-row>
                        <b-row align-v="center" class="mt-5">
                            <b-col class="text-center">
                                <loader-button
                                    :disabled="isMobileVerified && isEmailVerified"
                                    :is-loading="isLoading"
                                    button-text="save"
                                />
                            </b-col>
                        </b-row>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { email, required } from 'vuelidate/lib/validators'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Vue from 'vue'
import { DeepNullable } from '~/global'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import { useBase } from '~/composables/useBase'
import { useValidation } from '~/composables/useValidation'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
    },
    validations: {
        updateIdentityRootUser: {
            mobile: {
                number: {
                    required,
                },
                countryCode: { required },
            },
            email: {
                required,
                email,
            },
        },
    },
    middleware: ['kyVerified'],
})
export default class Profile extends Vue {
    base = useBase(this)
    validation = useValidation()

    numberIsValid: boolean | null = null

    updateIdentityRootUser: DeepNullable<{ mobile: MobileModel; email: string }> = {
        mobile: {
            number: null,
            countryCode: null,
        },
        email: null,
    }

    isLoading: boolean = false

    mobile: {
        countryCode: string
        number: string
    } = {
        countryCode: '',
        number: '',
    }

    get isMobileVerified() {
        return this.base.unRefs.isConsumer
            ? this.base.unRefs.consumer?.rootUser.mobileNumberVerified
            : this.base.unRefs.corporate?.rootUser.mobileNumberVerified
    }

    get isEmailVerified() {
        return this.base.unRefs.isConsumer
            ? this.base.unRefs.consumer?.rootUser.emailVerified
            : this.base.unRefs.corporate?.rootUser.emailVerified
    }

    fetch() {
        this.updateIdentityRootUser = {
            mobile: {
                countryCode: this.base.unRefs.isConsumer
                    ? this.base.unRefs.consumer?.rootUser?.mobile.countryCode ?? null
                    : this.base.unRefs.corporate?.rootUser?.mobile.countryCode ?? null,
                number: this.base.unRefs.isConsumer
                    ? this.base.unRefs.consumer?.rootUser?.mobile.number ?? null
                    : this.base.unRefs.corporate?.rootUser?.mobile.number ?? null,
            },
            email: this.base.unRefs.isConsumer
                ? this.base.unRefs.consumer?.rootUser?.email ?? null
                : this.base.unRefs.corporate?.rootUser?.email ?? null,
        }

        if (
            !(
                this.updateIdentityRootUser.mobile?.countryCode &&
                this.updateIdentityRootUser.mobile.number
            )
        ) {
            return
        }

        const _parsedNumber = parsePhoneNumberFromString(
            this.updateIdentityRootUser.mobile!.countryCode! +
                this.updateIdentityRootUser.mobile!.number
        )

        this.mobile = {
            countryCode: _parsedNumber?.country ?? '',
            number: this.updateIdentityRootUser.mobile?.number ?? '',
        }
    }

    phoneUpdate(number) {
        this.$set(this.mobile, 'number', number.phoneNumber)
        this.$set(this.mobile, 'countryCode', '+' + number.countryCallingCode)
        this.updateIdentityRootUser.mobile = { ...this.mobile }
        this.numberIsValid = number.isValid
    }

    doUpdateIdentityRoot(e) {
        e.preventDefault()

        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        this.$v.$touch()

        if (this.$v.$invalid) {
            return
        }

        this.isLoading = true

        const xhr: Promise<any>[] = []

        this.base.unRefs.isConsumer
            ? xhr.push(
                  this.base.stores.consumers.update(
                      this.updateIdentityRootUser as UpdateConsumerRequest
                  )
              )
            : xhr.push(
                  this.base.stores.corporates.update(
                      this.updateIdentityRootUser as UpdateCorporateRequest
                  )
              )

        Promise.all(xhr).finally(() => {
            this.isLoading = false
        })
    }
}
</script>
