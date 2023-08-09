<template>
    <div></div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

@Component({
    layout: 'dashboard',
})
export default class DashboardPage extends mixins(BaseMixin) {
    asyncData({ redirect }) {
        redirect('/managed-cards')
    }
}
</script>
