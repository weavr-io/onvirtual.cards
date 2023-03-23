<template>
  <div></div>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { identitiesStore } from '@/utils/store-accessor'

@Component({})
export default class Mobile extends Vue {
  asyncData({ redirect, store }) {
    if (identitiesStore(store).mobileNumberVerified) {
      return redirect('/dashboard')
    }
  }
}
</script>
