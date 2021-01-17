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
    this._span = this.$weavrComponents.span.cvv(
            this.token,
            this.spanOptions
    )
    this._span.mount(this.$el)
    this._addListeners(this._span)
  }

  beforeDestroy() {
    this._removeListeners(this._span)
    this._span.destroy()
  }

  _addListeners(input) {
    this.onReady && input.on('ready', this.onReady)
    this.onChange && input.on('change', this.onChange)
  }

  _removeListeners(input) {
    this.onReady && input.off('ready', this.onReady)
    this.onChange && input.off('change', this.onChange)
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
