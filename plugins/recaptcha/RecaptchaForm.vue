<template>
    <div ref="recaptcha"></div>
</template>

<script setup lang="ts">
import { useReCaptcha } from 'vue-recaptcha-v3'

const recaptcha = ref(null)

onMounted(async () => {
    await useReCaptcha()?.recaptchaLoaded()
})

const execute = async (status: string) => {
    try {
        await useReCaptcha()?.recaptchaLoaded()

        return await useReCaptcha()?.executeRecaptcha(status)
    } catch (e) {
        console.error('error:', e)
        throw e
    }
}

defineExpose({ execute })
</script>
