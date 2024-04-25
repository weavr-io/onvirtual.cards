<template>
    <div :class="classes" class="text-center">
        <component :is="link ? 'b-link' : 'span'" v-bind="dynamicProps">
            <LogoImage :size="props.imgSize" class="align-top" />
        </component>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import LogoImage from '~/components/atoms/LogoImage.vue'

const props = withDefaults(
    defineProps<{
        classes?: string
        imgSize?: 'sm' | 'md' | 'lg'
        link?: boolean
        url?: string
    }>(),
    {
        imgSize: 'lg',
        classes: '',
        link: true,
        url: '/',
    },
)

const dynamicProps = computed(() => {
    return props.link
        ? {
              to: props.url,
          }
        : {}
})
</script>
