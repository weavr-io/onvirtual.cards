<template>
    <img
        :loading="props.loading"
        alt="onvirtual.cards"
        class="d-inline-block"
        src="@/assets/imgs/logo.svg"
        v-bind="dimensions"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg'
        loading?: 'eager' | 'lazy'
    }>(),
    {
        size: 'lg',
        loading: 'eager',
    },
)

const dimensions = computed(() => {
    return {
        ...(props.size === 'sm' && {
            height: '15px',
        }),
        ...(props.size === 'md' && {
            width: '160px',
        }),
        ...(props.size === 'lg' && {
            width: '200px',
        }),
    }
})
</script>
