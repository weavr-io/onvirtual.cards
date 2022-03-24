<template>
  <div>
    <b-row class="justify-content-center my-5">
      <b-col md="8">
        <h2 class="font-weight-light text-center line-height-lg">
          Will you be using OnVirtual Cards for personal or business use?
        </h2>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col md="9">
        <b-card-group deck>
          <b-card class="" no-body>
            <b-card-body class="p-5">
              <b-card-title title-tag="h3" class="font-weight-light">
                Business
              </b-card-title>
              <b-card-text class="mt-4 mb-5">
                Issue cards and assign them to employees. You decide when to stop cards or add more funds.
              </b-card-text>
              <b-img src="/img/large-arrow.svg" />
              <b-link to="/register/corporate" class=" stretched-link" />
            </b-card-body>
          </b-card>
          <b-card class="" no-body>
            <b-card-body class="p-5">
              <b-card-title title-tag="h3" class="font-weight-light">
                Personal
              </b-card-title>
              <b-card-text class="mt-4 mb-5">
                Take control of your online purchases and shop securely without exposing your bank card.
              </b-card-text>
              <b-img src="/img/large-arrow.svg" />
              <b-link to="/register/consumer" class=" stretched-link" />
            </b-card-body>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BusinessOrPersonalComponent extends Vue {}
</script>
