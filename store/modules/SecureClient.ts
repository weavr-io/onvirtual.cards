import {
  Getters,
  Actions,
  State,
  _Mutations,
  Mutations,
  name,
  namespaced,
  Helpers
} from '~/store/modules/Contracts/SecureClient'
import { RootState } from '~/store'

export { name, namespaced, Helpers }

export const state = (): State => ({
  form: null
})

export const getters: Getters<State, RootState> = {
  form: (state) => {
    return state.form
  }
}

export const mutations: Mutations<State> = {
  SET_FORM(state, form: any) {
    state.form = form
  }
}

export const actions: Actions<State, RootState> = {
  form({ commit }, form) {
    return commit(_Mutations.SET_FORM, form)
  },
  tokenize({ state }) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      console.log('Tokenising form: ' + state.form?._id)
      state.form?.tokenize(
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
