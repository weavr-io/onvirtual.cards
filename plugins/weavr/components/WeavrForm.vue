<template>
  <div>
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
class WeavrForm extends Vue {
  public form

  protected _inputs

  constructor() {
    super(...arguments)
    // @ts-ignore
    this.form = window.OpcUxSecureClient.form()
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
