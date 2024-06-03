<template>
    <div :class="className" :style="baseStyle" />
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class WeavrCvvSpan extends Vue {
    @Prop() readonly token!: string

    @Prop() readonly options!: object

    @Prop() readonly className!: string

    @Prop() readonly baseStyle!: object

    @Emit('onReady') onReady() {}

    @Emit('onChange') onChange() {}

    protected _span

    mounted() {
        this._span = this.$weavrComponents.display.cvv(this.token, this.spanOptions)
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
            style: this.baseStyle,
        }
    }
}
</script>

<style lang="scss" scoped></style>
