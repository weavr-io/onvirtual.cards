<template>
    <b-form-group class="mb-0">
        <b-overlay :show="props.isLoading" class="d-inline-block" rounded="pill" spinner-small>
            <b-button type="submit" variant="secondary">
                {{ props.text }}
                <span v-if="props.showArrow" class="pl-5">-></span>
            </b-button>
        </b-overlay>
    </b-form-group>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        isLoading?: boolean
        showArrow?: boolean
        text?: string
    }>(),
    {
        text: '',
    },
)
</script>
