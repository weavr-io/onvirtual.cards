<template>
    <div v-if="props.isLoading || props.show" :class="flexCenter">
        <div class="loader-spinner">
            <b-spinner />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    isLoading?: boolean
    center?: boolean
    show?: boolean
}>()

const flexCenter = computed(() => (props.center ? 'd-flex flex-column align-items-center' : ''))
</script>
