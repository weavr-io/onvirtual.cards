<template>
    <b-form-group class="mb-0">
        <b-overlay :show="isLoading" rounded="pill" class="d-inline-block" spinner-small>
            <b-button type="submit" variant="secondary">
                {{ buttonText }}
                <span v-if="showArrow" class="pl-5">-></span>
            </b-button>
        </b-overlay>
    </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
class LoaderButton extends Vue {
    @Prop({ default: false }) isLoading!: boolean
    @Prop({ default: true }) showArrow!: boolean

    @Prop({ default: 'Button Text' }) buttonText!: string
}

export default LoaderButton
</script>
