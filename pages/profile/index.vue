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
                                        :value="rootName"
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
                                        :value="rootSurname"
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
                                    :invalid-feedback="validation.getInvalidFeedback('email')"
                                    :state="validation.getState('email')"
                                    label="E-Mail"
                                >
                                    <b-form-input
                                        v-model="updateIdentityRootUser.email"
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
                                <LoaderButton
                                    :disabled="isMobileVerified && isEmailVerified"
                                    :is-loading="isLoading"
                                    text="save"
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
import { Component, mixins } from 'nuxt-property-decorator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { reactive } from 'vue'
import BaseMixin from '~/mixins/BaseMixin'

import {
    INITIAL_UPDATE_CONSUMER_REQUEST,
    UpdateConsumerRequest,
    UpdateConsumerRequestSchema,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        LoaderButton,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
    middleware: ['kyVerified'],
})
export default class Profile extends mixins(BaseMixin) {
    numberIsValid: boolean | null = null

    updateIdentityRootUser = reactive(INITIAL_UPDATE_CONSUMER_REQUEST())

    isLoading = false
    mobile: {
        countryCode: string
        number: string
    } = {
        countryCode: '',
        number: '',
    }

    get validation() {
        return useZodValidation(UpdateConsumerRequestSchema, this.updateIdentityRootUser)
    }

    get isMobileVerified() {
        return this.isConsumer
            ? this.consumer?.rootUser.mobileNumberVerified
            : this.corporate?.rootUser.mobileNumberVerified
    }

    get isEmailVerified() {
        return this.isConsumer
            ? this.consumer?.rootUser.emailVerified
            : this.corporate?.rootUser.emailVerified
    }

    fetch() {
        Object.assign(this.updateIdentityRootUser, {
            mobile: {
                countryCode: this.isConsumer
                    ? this.consumer?.rootUser?.mobile.countryCode ?? null
                    : this.corporate?.rootUser?.mobile.countryCode ?? null,
                number: this.isConsumer
                    ? this.consumer?.rootUser?.mobile.number ?? null
                    : this.corporate?.rootUser?.mobile.number ?? null,
            },
            email: this.isConsumer
                ? this.consumer?.rootUser?.email ?? null
                : this.corporate?.rootUser?.email ?? null,
        })

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
                this.updateIdentityRootUser.mobile!.number,
        )

        this.mobile = {
            countryCode: _parsedNumber?.country ?? '',
            number: this.updateIdentityRootUser.mobile?.number ?? '',
        }
    }

    phoneUpdate(number) {
        this.mobile.countryCode = this.mobile.countryCode && `+${number.countryCallingCode}`
        this.mobile.number = number.phoneNumber

        this.updateIdentityRootUser.mobile = { ...this.mobile }
        this.numberIsValid = number.isValid
    }

    async doUpdateIdentityRoot() {
        this.isLoading = true

        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        await this.validation.validate()

        if (this.validation.isInvalid.value || !this.numberIsValid) {
            this.isLoading = false
            return
        }

        const xhr: Promise<any>[] = []

        this.isConsumer
            ? xhr.push(
                  this.consumersStore.update(this.updateIdentityRootUser as UpdateConsumerRequest),
              )
            : xhr.push(
                  this.corporatesStore.update(
                      this.updateIdentityRootUser as UpdateCorporateRequest,
                  ),
              )

        Promise.all(xhr).finally(() => {
            this.isLoading = false
        })
    }
}
</script>
