<template>
  <span>
    <span v-if="value.merchantName" class="transaction-from text-muted">
      <span class="mx-2">&bull;</span>{{ value.merchantName }}
    </span>
  </span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({})
export default class StatementItemAdditionalField extends Vue {
  @Prop({ default: '' })
  readonly value!: {
    [k: string]: string
  }
}
</script>
