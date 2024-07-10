<template>
    <img
        v-bind="dimensions"
        :loading="props.loading"
        alt="onvirtual.cards"
        class="d-inline-block"
        src="@/assets/imgs/logo.svg"
    />
</template>

<script lang="ts" setup>
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
