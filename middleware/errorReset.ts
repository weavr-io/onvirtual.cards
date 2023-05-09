import { errorsStore } from '~/utils/store-accessor'

export default function (ctxt) {
    return errorsStore(ctxt.store).RESET_ERROR()
}
