<template>
    <section>
        <b-container>
            <b-row align-h="center" class="py-5 my-5 text-center">
                <b-col lg="6" md="9">
                    <b-row>
                        <b-col>
                            <h2 class="font-weight-light">KYC process cannot start</h2>
                            <h5 class="font-weight-lighter">
                                We're sorry but you cannot start a new verification process at this
                                time. This is possibly due to documents which have already been
                                submitted and are currently under review. If the issue persists,
                                please contact support@onvirtual.cards for assistance.
                            </h5>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'kyVerified',
})
</script>
