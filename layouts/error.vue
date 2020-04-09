<template>
  <b-container class="container-full-height">
    <b-row class="full-height-vh" align-v="center">
      <b-col class="text-center" lg="6" offset-lg="3">
        <template v-if="is404">
          <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#232A47" viewBox="0 0 48 48">
            <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
          </svg>
          <h1 class="font-weight-light mt-3 mb-5">
            Page not found.
          </h1>
          <b-button variant="secondary" to="/">
            go to dashboard
          </b-button>
        </template>
        <template v-else>
          <h1 class="font-weight-light">Oh snap!</h1>
          <h5 class="text-grey font-weight-normal">Something is not right.</h5>
          <b-img src="/img/ohsnap.svg" fluid class="mt-5 mb-4"></b-img>
          <b-button variant="secondary" to="/">
            go to dashboard
          </b-button>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    is404() {
      return this.statusCode === 404
    }
  },
  mounted() {
    switch (this.error.statusCode) {
      case 401:
        this.$router.replace('/login')
        break
      case 403:
        this.$router.replace('/forbidden')
        break
    }
  },
  head() {
    return {
      title: this.statusCode === 404 ? 'Page Not Found' : 'Oh snap!',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.container-full-height {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
