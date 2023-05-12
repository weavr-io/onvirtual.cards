<template>
    <div>
        <b-row>
            <b-col>
                <h2 class="text-center font-weight-lighter">Card topped up</h2>
            </b-col>
        </b-row>
        <b-row align-h="center" class="py-5 my-5">
            <b-col lg="6" md="9">
                <b-img src="/img/success.svg" />
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-center">
                <b-button type="submit" variant="secondary" @click="goToCards">
                    continue
                    <span class="pl-5">-></span>
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component({})
export default class TopUpSuccess extends Vue {
    goToCards(e: Event) {
        e.preventDefault()
        this.$router.push('/managed-cards')
    }
}
</script>
