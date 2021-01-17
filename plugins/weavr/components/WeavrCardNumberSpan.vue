<template>
  <div :class="className" :style="baseStyle" />
  </template>
  <script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
class WeavrSpan extends Vue {
  @Prop() readonly token!: string

  @Prop() readonly options!: object

  @Prop() readonly className!: string

  @Prop() readonly baseStyle!: object

  @Emit('onReady') onReady() {
  }

  @Emit('onChange') onChange() {
  }

  protected _span

  mounted() {
    this._span = this.$weavrComponents.span.cardNumber(
      this.token,
      this.spanOptions
    )
    this._span.mount(this.$el)
    this._addListeners()
  }

  beforeDestroy() {
    this._removeListeners()
    this._span.destroy()
  }

  _addListeners() {
    this.onReady && this._span.on('ready', this.onReady)
    this.onChange && this._span.on('change', this.onChange)
  }

  _removeListeners() {
    this.onReady && this._span.off('ready', this.onReady)
    this.onChange && this._span.off('change', this.onChange)
  }

  get spanOptions() {
    return {
      ...this.options,
      style: this.baseStyle
    }
  }
}

export default WeavrSpan
</script>

<style lang="scss" scoped></style>
