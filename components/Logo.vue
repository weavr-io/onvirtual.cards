<template>
    <div class="text-center" :class="baseClass">
        <b-link to="/">
            <img
                src="/img/logo.svg"
                width="200"
                class="d-inline-block align-top"
                alt="onvirtual.cards"
            />
        </b-link>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Logo extends Vue {
    @Prop(String) baseClass?: string
}
</script>
