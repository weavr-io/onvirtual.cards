<template>
    <b-card no-body>
        <b-card-body class="p-5 px-sm-4 px-lg-5 py-sm-5">
            <div class="d-flex flex-column h-100 justify-content-between">
                <div>
                    <b-card-title class="fw-light" title-tag="h3">{{ props.title }} </b-card-title>
                    <b-card-text class="mt-4 mb-5">
                        {{ props.description }}
                    </b-card-text>
                </div>
                <div>
                    <b-img src="/img/large-arrow.svg" />
                    <b-link :to="props.link" class="stretched-link" />
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
    title: string
    description: string
    link: string
}>()
</script>
