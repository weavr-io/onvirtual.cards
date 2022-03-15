<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card body-class="p-6">
      <template>
        <h3 class="text-center font-weight-light mb-4">
          Enter the access code for registration
        </h3>
        <div class="small text-center mb-6">
          If you need an access code please send us an email at <a href="mailto: sales@weavr.io">sales@weavr.io</a>
        </div>
        <b-form @submit="tryToSubmitAccessCode">
          <b-form-input placeholder="Enter your access code" />
          <b-form-row class="mt-5">
            <b-col class="text-center">
              <b-button variant="secondary" type="submit">
                submit
                <span class="pl-5">-></span>
              </b-button>
            </b-col>
          </b-form-row>
        </b-form>
      </template>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'

@Component({})
export default class AccessCodeComponent extends mixins(BaseMixin) {
  tryToSubmitAccessCode(e) {
    e.preventDefault()
  }
}
</script>

<style scoped></style>
