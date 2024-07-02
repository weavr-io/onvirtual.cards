<template>
    <section>
        <b-container>
            <b-row :class="{ 'd-none': accessTokenError }">
                <b-col>
                    <weavr-kyc-beneficiaries
                        :options="kybOptions"
                        :reference="reference"
                        @message="handleSumSubMessage"
                    />
                </b-col>
            </b-row>
        </b-container>
        <b-container v-if="accessTokenError">
            <b-row align-h="center">
                <b-col md="6">
                    <b-alert show variant="danger">
                        <p class="text-center m-0">
                            The link that you are trying to use may have expired. Please contact
                            your main account holder to obtain a new link.
                        </p>
                    </b-alert>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts" setup>
import { computed, ref, useRoute } from '@nuxtjs/composition-api'
import { KYBOptions } from '~/plugins/weavr/components/api'

const route = useRoute()

const reference = ref(route.value.query.reference)
const accessTokenError = ref(false)

const kybOptions = computed(() => {
    return {
        customCSS: '',
    } as KYBOptions
})

const handleSumSubMessage = (message) => {
    if (message.messageType === 'idCheck.onError') {
        if (message.payload.error === 'Access token required') {
            accessTokenError.value = true
        }
    }
}
</script>
