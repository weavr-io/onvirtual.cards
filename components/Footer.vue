<template>
    <footer class="mt-5">
        <b-container>
            <b-row class="border-top py-5">
                <b-col>
                    <p class="text-center text-secondary mb-0">
                        Framered Ltd is a registered trademarks and licensed in the UK.
                    </p>
                </b-col>
            </b-row>
        </b-container>
    </footer>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped>
p {
    font-size: 10px;
}
</style>
