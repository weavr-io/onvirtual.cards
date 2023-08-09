<template>
    <div class="mb-5">
        <b-row class="justify-content-center my-5">
            <b-col md="8">
                <h2 class="font-weight-light text-center line-height-lg">
                    Will you be using OnVirtual Cards for personal or business use?
                </h2>
            </b-col>
        </b-row>
        <b-row class="justify-content-center">
            <b-col md="9">
                <b-card-group deck>
                    <registration-card
                        title="Business"
                        description="Issue cards and assign them to employees. You decide when to stop cards or add more funds."
                        link="/register/corporate"
                    />
                    <registration-card
                        title="Personal"
                        description="Take control of your online purchases and shop securely without exposing your bank card."
                        link="/register/consumer"
                    />
                </b-card-group>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import RegistrationCard from '~/components/registration/RegistrationCard.vue'

@Component({
    components: { RegistrationCard },
})
export default class BusinessOrPersonalComponent extends Vue {}
</script>
