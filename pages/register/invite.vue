<template>
  <access-code-component></access-code-component>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '../../minixs/BaseMixin'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'

@Component({
  layout: 'auth',
  components: { AccessCodeComponent }
})
export default class Invite extends mixins(BaseMixin) {}
</script>

<style scoped></style>
