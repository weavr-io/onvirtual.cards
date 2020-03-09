<template>
  <div :class="className" :style="baseStyle" class="weavr-input" />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'
import { SecureForm, SecureInputOptions } from '~/plugins/weavr/components/api'

@Component
class WeavrInput extends Vue {
  @Prop() readonly form!: SecureForm

  @Prop() readonly name!: string

  @Prop() readonly placeholder!: string

  @Prop() readonly value!: string

  @Prop() readonly field!: 'password' | 'cardNumber' | 'cvv'

  @Prop() readonly options!: SecureInputOptions

  @Prop() readonly className!: string

  @Prop() readonly customStyle!: object

  @Prop() readonly baseStyle!: object

  @Prop() readonly emptyStyle!: object

  @Prop() readonly validStyle!: object

  @Prop() readonly invalidStyle!: object

  @Emit('onReady') onReady() {}

  @Emit('onChange') onChange() {}

  @Emit('onKeyUp') onKeyUp() {}

  @Emit('onBlur') onBlur() {}

  @Emit('onFocus') onFocus() {}

  protected _input

  mounted() {
    // debugger
    const form = this.$parent as WeavrForm
    this._input = form.input(this.name, this.field, this.inputOptions)
    this._input.mount(this.$el)
    this._addListeners(this._input)
  }

  beforeDestroy() {
    this._removeListeners(this._input)
    this._input.destroy()
  }

  _addListeners(input) {
    this.onReady && input.on('ready', this.onReady)
    this.onChange && input.on('change', this.onChange)
    this.onKeyUp && input.on('keyup', this.onKeyUp)
    this.onBlur && input.on('blur', this.onBlur)
    this.onFocus && input.on('focus', this.onFocus)
  }

  _removeListeners(input) {
    this.onReady && input.off('ready', this.onReady)
    this.onChange && input.off('change', this.onChange)
    this.onKeyUp && input.off('keyup', this.onKeyUp)
    this.onBlur && input.off('blur', this.onBlur)
    this.onFocus && input.off('focus', this.onFocus)
  }

  get inputOptions() {
    return {
      ...this.options,
      style: {
        base: this.baseStyle,
        empty: this.emptyStyle,
        valid: this.validStyle,
        invalid: this.invalidStyle
      }
    }
  }
}

export default WeavrInput
</script>

<style lang="scss" scoped></style>
