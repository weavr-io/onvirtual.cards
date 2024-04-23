<template>
    <div :class="classes" class="text-center">
        <component :is="link ? 'b-link' : 'span'" v-bind="dynamicProps">
            <img
                alt="onvirtual.cards"
                class="d-inline-block align-top"
                loading="eager"
                src="/img/logo.svg"
                v-bind="dimensions"
            />
        </component>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        classes?: string
        size?: 'sm' | 'md' | 'lg'
        link?: boolean
        url?: string
    }>(),
    {
        size: 'lg',
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

const dimensions = computed(() => {
    return {
        ...(props.size === 'sm' && {
            height: '15px',
        }),
        ...(props.size === 'md' && {
            height: '160px',
        }),
        ...(props.size === 'lg' && {
            width: '200px',
        }),
    }
})
</script>
