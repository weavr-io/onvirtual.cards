import VueRouter, { Route } from 'vue-router'
import { BaseVue } from '~/base/classes/BaseVue'

export class VueWithRouter extends BaseVue {
  // @ts-ignore
  $router: VueRouter

  // @ts-ignore
  $route: Route
}
