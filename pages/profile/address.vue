<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-md-card">
                    <div class="form-screens">
                        <error-alert />
                        <div class="form-screen">
                            <b-form novalidate @submit.prevent="submitForm">
                                <h3 class="text-center fw-light mb-5">Your address details</h3>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('addressLine1')
                                    "
                                    :state="validation.getState('addressLine1')"
                                    label="Address Line 1*"
                                >
                                    <b-form-input
                                        v-model="address.addressLine1"
                                        placeholder="Address Line 1"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('addressLine2')
                                    "
                                    :state="validation.getState('addressLine2')"
                                    label="Address Line 2"
                                >
                                    <b-form-input
                                        v-model="address.addressLine2"
                                        placeholder="Address Line 2"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('city')"
                                    :state="validation.getState('city')"
                                    label="City*"
                                >
                                    <b-form-input v-model="address.city" placeholder="City" />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('country')"
                                    :state="validation.getState('country')"
                                    label="Country*"
                                >
                                    <b-form-select
                                        v-model="address.country"
                                        :options="countryOptionsWithDefault"
                                        placeholder="Registration Country"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('postCode')"
                                    :state="validation.getState('postCode')"
                                    label="Post Code*"
                                >
                                    <b-form-input
                                        v-model="address.postCode"
                                        placeholder="Post Code"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('state')"
                                    :state="validation.getState('state')"
                                    label="State"
                                >
                                    <b-form-input v-model="address.state" placeholder="State" />
                                </b-form-group>
                                <b-row align-v="center" class="mt-4">
                                    <b-col class="text-center">
                                        <LoaderButton
                                            :is-loading="isLoading"
                                            text="continue"
                                            type="submit"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form>
                        </div>
                    </div>
                </b-card-body>
            </b-card>
        </div>
    </b-col>
</template>

<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import {
    type Address,
    AddressSchema,
    CorporateSourceOfFundsSelectConst,
    INITIAL_ADDRESS,
    IndustryTypeSelectConst,
} from '~/plugins/weavr-multi/api/models/common'
import type { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'
import type { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

definePageMeta({
    layout: 'auth',
    middleware: 'auth-route-guard',
})
const {
    consumer,
    corporate,
    isConsumer,
    isCorporate,
    goToVerify,
    goToIndex,
    countryOptionsWithDefault,
} = useBase()
const { consumers, corporates } = useStores(['consumers', 'corporates'])

const isLoading = ref(false)
const address: Address = reactive(INITIAL_ADDRESS())

const validation = computed(() => {
    return useZodValidation(AddressSchema, address)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const country = computed({
    get() {
        return address.country
    },
    set(value) {
        address.country = value
    },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sourceOfFundsOptions = computed(() => {
    return CorporateSourceOfFundsSelectConst
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const industryOccupationOptions = computed(() => {
    return IndustryTypeSelectConst
})

onBeforeMount(() => {
    if (isConsumer.value && consumer.value) {
        if (Object.keys(consumer.value.rootUser.address as Address).length) {
            Object.assign(address, consumer.value.rootUser.address)
        }
    } else if (isCorporate.value && corporate.value) {
        if (Object.keys(corporate.value.company.registeredAddress as Address).length) {
            // treat as corporate
            Object.assign(address, corporate.value.company.registeredAddress)
        }
    }
})

const submitForm = async () => {
    isLoading.value = true
    await validation.value.validate()

    if (validation.value.isInvalid.value) {
        isLoading.value = false
        return
    }

    let xhr: Promise<unknown>

    if (isConsumer.value) {
        xhr = consumers!.update({ address })
    } else {
        // treat as corporate
        xhr = corporates!.update({
            companyBusinessAddress: address,
        })
    }
    xhr.then(addressUpdated).finally(() => {
        isLoading.value = false
    })
}

const addressUpdated = async () => {
    let identityRootVerified: CorporatesRootUserModel | ConsumersRootUserModel

    if (isConsumer.value) {
        await consumers?.get().then((res) => {
            identityRootVerified = res.data.rootUser

            if (
                identityRootVerified &&
                !(identityRootVerified as ConsumersRootUserModel).emailVerified
            ) {
                goToVerify()
            } else {
                goToIndex()
            }
        })
    } else if (isCorporate.value) {
        await corporates?.get().then((res) => {
            identityRootVerified = res.data.rootUser

            if (
                identityRootVerified &&
                !(identityRootVerified as CorporatesRootUserModel).emailVerified
            ) {
                goToVerify()
            } else {
                goToIndex()
            }
        })
    }
}
</script>
