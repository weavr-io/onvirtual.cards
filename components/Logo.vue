<template>
  <div class="text-center mb-5">
    <b-link to="/">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </b-link>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Logo extends Vue {}
</script>
