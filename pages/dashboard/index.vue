<template>
    <div></div>
</template>
<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
    layout: 'dashboard',
    setup() {
        const router = useRouter()
        router.push('/managed-cards')
    },
})
</script>
