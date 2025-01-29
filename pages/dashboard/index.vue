<template>
    <div></div>
</template>
<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
})

const router = useRouter()
router.replace('/managed-cards')
</script>
