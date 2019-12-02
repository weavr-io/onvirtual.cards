<template>
  <section>
    <b-container>
      <b-row>
        <b-col class="text-center">Loading</b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class IndexPage extends Vue {
  created() {
    this.$router.push('/login')
  }
}
</script>
