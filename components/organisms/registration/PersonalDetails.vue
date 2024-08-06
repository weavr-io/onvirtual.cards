<template>
    <b-form novalidate @submit.prevent="submitForm">
        <h3 class="text-center fw-light mb-5">A few more steps</h3>
        <ErrorAlert />
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('rootUser,name')"
            :state="validation.getState('rootUser,name')"
            label="First Name*"
        >
            <b-form-input v-model="form.rootUser.name" placeholder="Name" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('rootUser,surname')"
            :state="validation.getState('rootUser,surname')"
            label="Last Name*"
        >
            <b-form-input v-model="form.rootUser.surname" placeholder="Last Name" />
        </b-form-group>
        <b-form-group label="MOBILE NUMBER*">
            <phone-number-input
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
            <b-form-invalid-feedback v-if="!numberIsValid" force-show>
                This field must be a valid mobile number.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('company,name')"
            :state="validation.getState('company,name')"
            label="Company Name*"
        >
            <b-form-input v-model="form.company.name" placeholder="Company Name" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('company,registrationNumber')"
            :state="validation.getState('company,registrationNumber')"
            label="Company Registration Number*"
        >
            <b-form-input v-model="form.company.registrationNumber" placeholder="C00000" />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('company,type')"
            :state="validation.getState('company,type')"
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
            :invalid-feedback="validation.getInvalidFeedback('company,registrationCountry')"
            :state="validation.getState('company,registrationCountry')"
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
            :invalid-feedback="validation.getInvalidFeedback('sourceOfFundsOther')"
            :state="validation.getState('sourceOfFundsOther')"
            label="Other"
        >
            <b-form-input
                v-model="form.sourceOfFundsOther"
                placeholder="Specify Other Source of Funds"
            />
        </b-form-group>
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('rootUser,companyPosition')"
            :state="validation.getState('rootUser,companyPosition')"
            label="My position within the company is*"
        >
            <b-form-radio
                v-model="firstCompanyPosition"
                :state="validation.getState('rootUser,companyPosition')"
                name="company-position"
            >
                I am a representative (with the relevant power of attorney)
            </b-form-radio>
            <b-form-radio
                v-model="lastCompanyPosition"
                :state="validation.getState('rootUser,companyPosition')"
                name="company-position"
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
                <LoaderButton
                    :is-loading="isLoadingRegistration"
                    class="text-center"
                    text="continue"
                />
            </b-col>
        </b-form-row>
    </b-form>
</template>

<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { CorporateSourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/CorporateSourceOfFundsSelectConst'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CompanyTypeSelectConst } from '~/plugins/weavr-multi/api/models/identities/corporates/consts/CompanyTypeSelectConst'
import { CompanyPositionEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import type { SelectOptionsModel } from '~/models/local/generic/SelectOptionsModel'
import {
    CreateCorporateFormSchema,
    type CreateCorporateRequest,
    INITIAL_CREATE_CORPORATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import useZodValidation from '~/composables/useZodValidation'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

const props = defineProps({
    baseForm: {
        type: Object as PropType<CreateCorporateRequest>,
        required: true,
    },
})

const emit = defineEmits(['submit', 'go-back'])

const { countryOptionsWithDefault, mobileCountries } = useBase()
const { corporates, errors } = useStores(['corporates', 'errors'])

const companyTypeOptionsWithDefault = ref<SelectOptionsModel[]>(CompanyTypeSelectConst)
const numberIsValid = ref<boolean | null>(null)

const form = reactive<CreateCorporateRequest>({
    ...INITIAL_CREATE_CORPORATE_REQUEST(),
    ...props.baseForm,
})

const validation = computed(() => useZodValidation(CreateCorporateFormSchema, form))

const firstCompanyPosition = computed({
    get: () => form.rootUser.companyPosition,
    set: (val: CompanyPositionEnum) => {
        form.rootUser.companyPosition = val ?? 'AUTHORISED_REPRESENTATIVE'
    },
})

const lastCompanyPosition = computed({
    get: () => form.rootUser.companyPosition,
    set: (val: CompanyPositionEnum) => {
        form.rootUser.companyPosition = val ?? 'DIRECTOR'
    },
})

const isLoadingRegistration = computed(() => corporates?.corporateState.isLoadingRegistration)
const industryOccupationOptions = computed(() => IndustryTypeSelectConst)
const sourceOfFundsOptions = computed(() => CorporateSourceOfFundsSelectConst)

const shouldShowOtherSourceOfFunds: ComputedRef<boolean> = computed(
    () => form.sourceOfFunds === CorporateSourceOfFundTypeEnum.OTHER,
)

const phoneUpdate = (number) => {
    form.rootUser.mobile.countryCode = number.countryCallingCode && `+${number.countryCallingCode}`
    form.rootUser.mobile.number = number.phoneNumber && number.phoneNumber.replace(/\s+/g, '')
    if (number.phoneNumber) {
        numberIsValid.value = number.isValid
    }
}

const submitForm = async () => {
    if (!numberIsValid.value) {
        numberIsValid.value = false
    }

    await validation.value.validate()

    if (validation.value.isInvalid.value || !numberIsValid) {
        return null
    }

    submit()
}

const submit = () => {
    errors?.resetState()
    emit('submit', form)
}
</script>

<style lang="scss" scoped>
#input-mobile-country-code {
    max-width: 100px;
}
</style>
