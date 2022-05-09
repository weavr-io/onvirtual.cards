import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'

const defaultState = {
  form: null
}

@Module({
  name: 'SecureClientModule',
  namespaced: true,
  stateFactory: true
})
export default class SecureClient extends StoreModule {
  form: any = defaultState.form

  @Mutation
  SET_FORM(form: any) {
    this.form = form
  }

  @Mutation
  RESET_STATE() {
    Object.keys(defaultState).forEach((key) => {
      this[key] = defaultState[key]
    })
  }

  @Action
  setForm(form: any) {
    this.SET_FORM(form)
  }

  @Action
  tokenize() {
    return new Promise((resolve, reject) => {
      this.form?.tokenize(
        (res) => {
          resolve(res)
        },
        (e) => {
          reject(e)
        }
      )
    })
  }
}
