<template>
    <b-form novalidate @submit="submitForm">
        <h3 class="text-center font-weight-light mb-5">A few more steps</h3>
        <error-alert />
        <b-form-group label="First Name*">
            <b-form-input
                v-model="$v.form.rootUser.name.$model"
                :state="isInvalid($v.form.rootUser.name)"
                placeholder="Name"
            />
            <b-form-invalid-feedback v-if="!$v.form.rootUser.name.required">
                This field is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.rootUser.name.maxLength">
                Name is too long.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Last Name*">
            <b-form-input
                v-model="$v.form.rootUser.surname.$model"
                :state="isInvalid($v.form.rootUser.surname)"
                placeholder="Last Name"
            />
            <b-form-invalid-feedback v-if="!$v.form.rootUser.surname.required">
                This field is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.rootUser.surname.maxLength">
                Surname is too long.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="MOBILE NUMBER*">
            <vue-phone-number-input
                :value="form.rootUser.mobile.number"
                :only-countries="mobileCountries"
                :border-radius="0"
                :error="numberIsValid === false"
                color="#6C1C5C"
                error-color="#F50E4C"
                valid-color="#6D7490"
                default-country-code="GB"
                @update="phoneUpdate"
            />
            <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                This field must be a valid mobile number.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Company Name*">
            <b-form-input
                v-model="$v.form.company.name.$model"
                :state="isInvalid($v.form.company.name)"
                placeholder="Company Name"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Company Registration Number*">
            <b-form-input
                v-model="$v.form.company.registrationNumber.$model"
                :state="isInvalid($v.form.company.registrationNumber)"
                placeholder="C00000"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Company Type*">
            <b-form-select
                v-model="$v.form.company.type.$model"
                :state="isInvalid($v.form.company.type)"
                :options="companyTypeOptionsWithDefault"
                placeholder="Company Type"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Registration Country*">
            <b-form-select
                v-model="$v.form.company.registrationCountry.$model"
                :state="isInvalid($v.form.company.registrationCountry)"
                :options="countryOptionsWithDefault"
                placeholder="Registration Country"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :state="isInvalid($v.form.industry)" label="Industry*">
            <b-form-select
                v-model="$v.form.industry.$model"
                :state="isInvalid($v.form.industry)"
                :options="industryOccupationOptions"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :state="isInvalid($v.form.sourceOfFunds)" label="Source of Funds*">
            <b-form-select
                v-model="$v.form.sourceOfFunds.$model"
                :state="isInvalid($v.form.sourceOfFunds)"
                :options="sourceOfFundsOptions"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group v-if="shouldShowOtherSourceOfFunds" label="Other">
            <b-form-input
                v-model="form.sourceOfFundsOther"
                :state="isInvalid($v.form.sourceOfFundsOther)"
                placeholder="Specify Other Source of Funds"
            />
        </b-form-group>
        <b-form-group
            :state="isInvalid($v.form.rootUser.companyPosition)"
            label="My position within the company is*"
        >
            <b-form-radio
                v-model="$v.form.rootUser.companyPosition.$model"
                :state="isInvalid($v.form.rootUser.companyPosition)"
                name="company-position"
                value="AUTHORISED_REPRESENTATIVE"
            >
                I am a representative (with the relevant power of attorney)
            </b-form-radio>
            <b-form-radio
                v-model="$v.form.rootUser.companyPosition.$model"
                :state="isInvalid($v.form.rootUser.companyPosition)"
                name="company-position"
                value="DIRECTOR"
            >
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
                <loader-button
                    :is-loading="isLoadingRegistration"
                    button-text="continue"
                    class="text-center"
                />
            </b-col>
        </b-form-row>
    </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import type { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import type { SelectOptionsModel } from '~/models/local/generic/SelectOptionsModel'
import type { DeepNullable, RecursivePartial } from '~/global'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CompanyTypeSelectConst } from '~/plugins/weavr-multi/api/models/identities/corporates/consts/CompanyTypeSelectConst'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import Countries from '~/assets/json/countries.json'

@Component({
    validations: {
        form: {
            rootUser: {
                name: {
                    required,
                    maxLength: maxLength(20),
                },
                surname: {
                    required,
                    maxLength: maxLength(20),
                },
                mobile: {
                    number: {
                        required,
                    },
                    countryCode: {
                        required,
                    },
                },
                companyPosition: {
                    required,
                },
            },
            company: {
                type: {
                    required,
                },
                name: {
                    required,
                    maxLength: maxLength(100),
                },
                registrationNumber: {
                    required,
                    maxLength: maxLength(20),
                },
                registrationCountry: {
                    required,
                    maxLength: maxLength(2),
                },
            },
            industry: {
                required,
            },
            sourceOfFunds: {
                required,
            },
            sourceOfFundsOther: {},
        },
    },
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
    },
})
export default class PersonalDetailsForm extends mixins(BaseMixin, ValidationMixin) {
    companyTypeOptionsWithDefault: SelectOptionsModel[] = CompanyTypeSelectConst
    numberIsValid: boolean | null = null
    public form: DeepNullable<RecursivePartial<CreateCorporateRequest>> = {
        rootUser: {
            name: null,
            surname: null,
            mobile: {
                number: null,
                countryCode: '',
            },
            companyPosition: null,
        },
        company: {
            type: null,
            name: null,
            registrationNumber: null,
            registrationCountry: null,
        },
        industry: null,
        sourceOfFunds: null,
        sourceOfFundsOther: null,
    }

    get mobileCountries(): string[] {
        return Countries.map((_c) => {
            return _c['alpha-2']
        })
    }

    get isLoadingRegistration() {
        return this.stores.corporates.isLoadingRegistration
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
        this.$v.form.rootUser!.mobile.number.$touch()
        this.$set(this.form.rootUser!.mobile!, 'countryCode', '+' + number.countryCallingCode)
        this.$set(this.form.rootUser!.mobile!, 'number', number.phoneNumber)
        this.numberIsValid = number.isValid
    }

    @Emit()
    submitForm(e) {
        e.preventDefault()
        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }
        if (this.$v.form) {
            this.$v.form.$touch()
            if (this.$v.form.$anyError || !this.numberIsValid) {
                return null
            }
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
