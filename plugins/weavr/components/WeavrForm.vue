<template>
  <div>
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import * as SecureClientStore from '~/store/modules/SecureClient'
import { SecureForm } from '~/plugins/weavr/components/api'

@Component({})
class WeavrForm extends Vue {
  public form!: SecureForm

  constructor() {
    super(...arguments)
    this.form = this.$OpcUxSecureClient.form()
    SecureClientStore.Helpers.form(this.$store, this.form)
  }

  tokenize(resolve, reject) {
    return SecureClientStore.Helpers.getForm(this.$store)?.tokenize(resolve, reject)
  }
}

export default WeavrForm
</script>

<style lang="scss" scoped></style>
