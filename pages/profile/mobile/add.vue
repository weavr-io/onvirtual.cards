<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <b-card body-class="p-card">
            <h3 class="text-center font-weight-light mb-4">Add your phone number</h3>
            <p class="text-center mb-5">
                We need your phone number to send you one-time passwords when logging in. we will
                not share this with anyone.
            </p>
            <b-form novalidate @submit.prevent="submitForm">
                <b-form-group label="MOBILE NUMBER*">
                    <vue-phone-number-input
                        :border-radius="0"
                        :error="numberIsValid === false"
                        :only-countries="mobileCountries"
                        :value="updateRequest.mobile.number"
                        color="#6C1C5C"
                        default-country-code="GB"
                        error-color="#F50E4C"
                        valid-color="#6D7490"
                        @update="phoneUpdate"
                    />
                    <b-form-invalid-feedback
                        v-if="numberIsValid === false"
                        force-show
                        style="position: absolute"
                    >
                        This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                </b-form-group>
                <LoaderButton :is-loading="isLoading" class="text-center mt-5" text="save number" />
            </b-form>
        </b-card>
    </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import BaseMixin from '~/mixins/BaseMixin'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import {
    INITIAL_MOBILE_REQUEST,
    Mobile,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/CredentialTypeEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import useZodValidation from '~/composables/useZodValidation'
import { RootUserMobileSchema } from '~/plugins/weavr-multi/api/models/identities/corporates'

@Component({
    layout: 'auth',
    components: {
        LogoOvc,
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
    },
    middleware: ['kyVerified'],
})
export default class LoginPage extends mixins(BaseMixin) {
    isLoading = false

    numberIsValid: boolean | null = null

    updateRequest: { mobile: Mobile } = reactive({
        mobile: {
            ...INITIAL_MOBILE_REQUEST(),
        },
    })

    get validation() {
        return useZodValidation(RootUserMobileSchema, this.updateRequest)
    }

    async asyncData({ redirect }) {
        const { auth } = initialiseStores(['auth'])

        await auth?.indexAuthFactors()

        const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
            (factor) => factor.channel === SCAOtpChannelEnum.SMS,
        )

        if (
            smsAuthFactors &&
            smsAuthFactors[0].status !== SCAFactorStatusEnum.PENDING_VERIFICATION
        ) {
            return redirect('/dashboard')
        }
    }

    async submitForm() {
        this.isLoading = true

        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        try {
            await this.validation.validate()

            if (this.validation.isInvalid.value || !this.numberIsValid) {
                this.isLoading = false
                return null
            }

            if (this.authStore.authState.auth?.credentials.type === CredentialTypeEnum.ROOT) {
                this.isConsumer
                    ? await this.consumersStore.update(this.updateRequest as UpdateConsumerRequest)
                    : await this.corporatesStore.update(
                          this.updateRequest as UpdateCorporateRequest,
                      )
            } else {
                await this.usersStore.update({
                    id: this.authStore.authState.auth!.credentials.id,
                    data: this.updateRequest as UpdateUserRequestModel,
                })
            }
            await this.$router.push({
                path: '/login/verify/mobile',
                query: {
                    send: 'true',
                },
            })
        } catch (error: any) {
            this.showErrorToast(error)
        } finally {
            this.isLoading = false
        }
    }

    phoneUpdate(number) {
        this.updateRequest.mobile.countryCode =
            number.countryCallingCode && `+${number.countryCallingCode}`
        this.updateRequest.mobile.number = number.phoneNumber

        this.numberIsValid = number.isValid
    }
}
</script>
