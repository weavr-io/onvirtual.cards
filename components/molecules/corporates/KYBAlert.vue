<template>
    <section>
        <b-container>
            <b-row v-if="isPendingReview" align-h="center">
                <b-col class="py-3 font-weight-lighter text-center">
                    <h3 class="font-weight-lighter mb-4">
                        Your account is currently under review.
                    </h3>
                    <p>This process normally takes a few days.</p>
                </b-col>
            </b-row>
            <b-row v-else align-h="center">
                <b-col class="py-3 font-weight-lighter" lg="6" md="9">
                    <h3 class="text-center font-weight-lighter mb-4">We need some documents</h3>
                    <p>
                        We are required by financial services regulations to perform due diligence
                        on your company before allowing you to transact with your account.
                    </p>
                    <p>Kindly prepare to submit and upload the following documents:</p>
                    <ul class="my-3 font-weight-normal">
                        <li>Copy of the Certificate of Incorporation</li>
                        <li>Copy of the Articles of Association (last amendment)</li>
                        <li>Proof of Business Address (e.g. lease agreement)</li>
                        <li>
                            UBO Declaration Form downloadable from
                            <a href="https://storage.cloud.google.com/weavr-cdn/UBO-a.pdf">here.</a>
                        </li>
                        <li>Commercial registry extract showing shareholders and directors</li>
                    </ul>
                    <p>You will also need to provide the following information:</p>
                    <ul class="my-3 font-weight-normal">
                        <li>
                            Directors: name, date of birth, nationality, email address, contact
                            number
                        </li>
                        <li>
                            Ultimate Beneficial Owners (UBOs) holding a stake of 25% or more: name,
                            date of birth, nationality
                        </li>
                    </ul>
                    <div class="text-center my-5">
                        <b-button to="/managed-accounts/kyb">
                            start the verification process
                        </b-button>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts" setup>
import { computed, ComputedRef } from 'vue'
import { useStores } from '~/composables/useStores'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

const { corporates } = useStores(['corporates'])

const isPendingReview: ComputedRef<boolean> = computed(
    () => corporates?.corporateState.kyb?.kybStatus === KYBStatusEnum.PENDING_REVIEW,
)
</script>
