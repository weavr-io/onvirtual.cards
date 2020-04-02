import * as ErrorStore from '~/store/modules/Error'

export default function(ctxt) {
  ErrorStore.Helpers.resetErrors(ctxt.store)
}
