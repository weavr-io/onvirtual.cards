import { CommitOptions, DispatchOptions, Store } from '~/node_modules/vuex'

export namespace StoreHelpers {
  export const getMutationString = (_name, _mutation) => {
    return _name + '/' + _mutation
  }
  export const commit = (store: Store<any>, name, mutation, payload?: any, options?: CommitOptions) => {
    const _string = getMutationString(name, mutation)
    return store.commit(_string, payload, options)
  }
  export const dispatch = (store: Store<any>, name, mutation, payload?: any, options?: DispatchOptions) => {
    const _string = getMutationString(name, mutation)
    return store.dispatch(_string, payload, options)
  }
}
