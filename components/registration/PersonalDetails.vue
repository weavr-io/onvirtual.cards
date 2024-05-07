<template>
    <b-form novalidate @submit.prevent="submitForm">
        <h3 class="text-center font-weight-light mb-5">A few more steps</h3>
        <error-alert />
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('rootUser.name')"
            :state="validation.getState('rootUser.name')"
            label="First Name*"
        >
            <b-form-input v-model="form.rootUser.name" placeholder="Name" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('surname')"
            :state="validation.getState('surname')"
            label="Last Name*"
        >
            <b-form-input v-model="form.rootUser.surname" placeholder="Last Name" />
        </b-form-group>
        <b-form-group label="MOBILE NUMBER*">
            <vue-phone-number-input
                :border-radius="0"
                :error="numberIsValid === false"
                :only-countries="mobileCountries"
                :value="form.rootUser.mobile.number"
                color="#6C1C5C"
                default-country-code="GB"
                error-color="#F50E4C"
                valid-color="#6D7490"
                @update="phoneUpdate"
            />
            <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                This field must be a valid mobile number.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('company.surname')"
            :state="validation.getState('company.surname')"
            label="Company Name*"
        >
            <b-form-input v-model="form.company.name" placeholder="Company Name" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('registrationNumber')"
            :state="validation.getState('registrationNumber')"
            label="Company Registration Number*"
        >
            <b-form-input v-model="form.company.registrationNumber" placeholder="C00000" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('registrationNumber')"
            :state="validation.getState('registrationNumber')"
            label="Company Type*"
        >
            <b-form-select
                v-model="form.company.type"
                :options="companyTypeOptionsWithDefault"
                placeholder="Company Type"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('registrationCountry')"
            :state="validation.getState('registrationCountry')"
            label="Registration Country*"
        >
            <b-form-select
                v-model="form.company.registrationCountry"
                :options="countryOptionsWithDefault"
                placeholder="Registration Country"
            />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('industry')"
            :state="validation.getState('industry')"
            label="Industry*"
        >
            <b-form-select v-model="form.industry" :options="industryOccupationOptions" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('sourceOfFunds')"
            :state="validation.getState('sourceOfFunds')"
            label="Source of Funds*"
        >
            <b-form-select v-model="form.sourceOfFunds" :options="sourceOfFundsOptions" />
        </b-form-group>
        <b-form-group
            v-if="shouldShowOtherSourceOfFunds"
            :state="validation.getState('sourceOfFundsOther')"
            label="Other"
        >
            <b-form-input
                v-model="form.sourceOfFundsOther"
                placeholder="Specify Other Source of Funds"
            />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('companyPosition')"
            :state="validation.getState('companyPosition')"
            label="My position within the company is*"
        >
            <b-form-radio v-model="firstCompanyPosition" name="company-position">
                I am a representative (with the relevant power of attorney)
            </b-form-radio>
            <b-form-radio v-model="lastCompanyPosition" name="company-position">
                I am a director
            </b-form-radio>
        </b-form-group>
        <p class="smaller text-muted">
            To open account on behalf of the company you need to be a director or authorised
            representative. To enable us to verify your identity, role and authorisation as part of
            our customer due diligence process, we will later ask you to upload the relevant ID and
            power of attorney documents.
        </p>
        <b-form-row class="mt-5">
            <b-col class="text-center">
                <LoaderButton
                    :is-loading="isLoadingRegistration"
                    class="text-center"
                    text="continue"
                />
            </b-col>
        </b-form-row>
        <pre>
            {{ form }}
        </pre>
    </b-form>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Component, Emit, mixins } from 'nuxt-property-decorator'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CompanyTypeSelectConst } from '~/plugins/weavr-multi/api/models/identities/corporates/consts/CompanyTypeSelectConst'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import { SelectOptionsModel } from '~/models/local/generic/SelectOptionsModel'
import {
    type CreateCorporateRequest,
    CreateCorporateRequestSchema,
    INITIAL_CREATE_CORPORATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import Countries from '~/static/json/countries.json'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
    },
})
export default class PersonalDetailsForm extends mixins(BaseMixin, ValidationMixin) {
    companyTypeOptionsWithDefault: SelectOptionsModel[] = CompanyTypeSelectConst
    numberIsValid: boolean | null = null

    form: CreateCorporateRequest = reactive(INITIAL_CREATE_CORPORATE_REQUEST)

    get validation() {
        return useZodValidation(CreateCorporateRequestSchema, this.form)
    }

    public get firstCompanyPosition() {
        return this.form.rootUser.companyPosition
    }

    public set firstCompanyPosition(val: CompanyPositionEnum) {
        this.form.rootUser.companyPosition = val ?? 'AUTHORISED_REPRESENTATIVE'
    }

    public get lastCompanyPosition() {
        return this.form.rootUser.companyPosition
    }

    public set lastCompanyPosition(val: CompanyPositionEnum) {
        this.form.rootUser.companyPosition = val ?? 'DIRECTOR'
    }

    get mobileCountries(): string[] {
        return Countries.map((_c) => {
            return _c['alpha-2']
        })
    }

    get isLoadingRegistration() {
        return this.corporatesStore.corporateState.isLoadingRegistration
    }

    get industryOccupationOptions() {
        return IndustryTypeSelectConst
    }

    get sourceOfFundsOptions() {
        return SourceOfFundsSelectConst
    }

    get shouldShowOtherSourceOfFunds(): boolean {
        return this.form.sourceOfFunds === CorporateSourceOfFundTypeEnum.OTHER
    }

    phoneUpdate(number) {
        if (!this.form.rootUser!.mobile.number) return

        this.$set(this.form.rootUser!.mobile!, 'countryCode', '+' + number.countryCallingCode)
        this.$set(this.form.rootUser!.mobile!, 'number', number.phoneNumber)
        this.numberIsValid = number.isValid
    }

    @Emit()
    async submitForm() {
        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        await this.validation.validate()

        if (this.validation.isInvalid || !this.numberIsValid) {
            return null
        }

        return this.form
    }

    @Emit()
    goBack(e) {
        e.preventDefault()
    }
}
</script>

<style lang="scss" scoped>
#input-mobile-country-code {
    max-width: 100px;
}
</style>
