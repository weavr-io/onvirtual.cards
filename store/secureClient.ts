import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'

@Module({
  name: 'SecureClientModule',
  namespaced: true,
  stateFactory: true
})
export default class SecureClient extends StoreModule {
  form: any = null

  @Mutation
  SET_FORM(form: any) {
    this.form = form
  }

  @Action
  setForm(form: any) {
    this.SET_FORM(form)
  }

  @Action
  tokenize() {
    return new Promise((resolve, reject) => {
      console.log('Tokenising form: ' + this.form?._id)
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
