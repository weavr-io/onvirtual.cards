<template>
    <div></div>
</template>
<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
    middleware: (_) => {
        return { path: '/managed-cards' }
    },
})
</script>
