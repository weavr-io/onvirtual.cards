<template>
  <div>
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { SecureForm } from '~/plugins/weavr/components/api'

@Component
class WeavrForm extends Vue {
  public form!: SecureForm

  protected _inputs

  constructor() {
    super(...arguments)
    this.form = this.$OpcUxSecureClient.form()
  }

  input(name, field, options) {
    this._inputs = this._inputs || {}
    if (!this._inputs[name] && field) {
      this._inputs[name] = this.form.input(name, field, options)
    }

    return this._inputs[name]
  }

  tokenize(resolve, reject) {
    return this.form.tokenize(resolve, reject)
  }
}

export default WeavrForm
</script>

<style lang="scss" scoped></style>
