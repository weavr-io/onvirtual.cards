<template>
  <section class="py-5">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <template v-if="isConsumer">
            {{ consumer }}
          </template>
          <template v-if="isCorporate">
            <b-card class="border card-sm-border-radius" no-body>
              <template v-slot:header>
                <h4 class="mb-0">{{ corporate.name }}</h4>
              </template>
              <b-card-body class="p-1">
                <b-list-group flush>
                  <b-list-group-item class="flex-column align-items-start ">
                    <div class="d-flex w-100 justify-content-between">
                      <p class="m-0">
                        Name
                      </p>
                      <p class="m-0">
                        {{ corporate.name }}
                      </p>
                    </div>
                  </b-list-group-item>
                  <b-list-group-item class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                      <p class="m-0">
                        Email
                      </p>
                      <p class="m-0">
                        {{ corporate.supportEmail }}
                      </p>
                    </div>
                  </b-list-group-item>
                </b-list-group>
              </b-card-body>
              <b-card-footer class="py-4">
                <b-link to="/profile/password/change" class="link">
                  Change Password
                </b-link>
              </b-card-footer>
            </b-card>
          </template>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'

const Auth = namespace(AuthStore.name)
const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component
export default class Profile extends Vue {
  @Auth.Action logout

  @Auth.Getter isConsumer!: boolean

  @Auth.Getter isCorporate!: boolean

  @Auth.Getter identityId!: number | null

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  async asyncData({ store }) {
    const _id = AuthStore.Helpers.identityId(store)

    if (_id) {
      if (AuthStore.Helpers.isConsumer(store)) {
        await ConsumersStore.Helpers.get(store, _id)
      } else if (AuthStore.Helpers.isCorporate(store)) {
        await CorporatesStore.Helpers.getCorporateDetails(store, _id)
      }
    }
  }
}
</script>
