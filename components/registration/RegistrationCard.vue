<template>
  <b-card no-body>
    <b-card-body class="p-5 px-sm-4 px-lg-5 py-sm-5">
      <div class="d-flex flex-column h-100 justify-content-between">
        <div>
          <b-card-title title-tag="h3" class="font-weight-light">{{ title }}</b-card-title>
          <b-card-text class="mt-4 mb-5">
            {{ description }}
          </b-card-text>
        </div>
        <div>
          <b-img src="/img/large-arrow.svg" />
          <b-link :to="link" class="stretched-link" />
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class RegistrationCard extends Vue {
  @Prop({ type: String, default: 'Title' }) title?: string
  @Prop({ type: String, default: 'Description' }) description?: string
  @Prop({ type: String }) link?: string
}
</script>
