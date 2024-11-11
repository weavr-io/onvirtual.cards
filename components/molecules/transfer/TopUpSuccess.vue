<template>
    <div>
        <b-row>
            <b-col>
                <h2 class="text-center fw-lighter">Card topped up</h2>
            </b-col>
        </b-row>
        <b-row align-h="center" class="py-5 my-5">
            <b-col lg="6" md="9">
                <b-img src="/img/success.svg" />
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-center">
                <b-button type="submit" variant="secondary" @click.prevent="goToCards">
                    continue
                    <span class="ps-5">-></span>
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>
<script lang="ts" setup>
const router = useRouter()

const goToCards = () => {
    router.push('/managed-cards')
}
</script>
