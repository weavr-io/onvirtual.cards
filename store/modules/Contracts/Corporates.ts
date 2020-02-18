import { ActionTree, ActionContext } from 'vuex'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import { SendEmailRequest } from '~/api/Requests/SendEmailRequest'

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_CORPORATE: 'SET_CORPORATE',
  SET_USERS: 'SET_USERS'
}

export interface State {
  isLoading: boolean
  corporate: CorporatesSchemas.Corporate | null
  users: any
}

export interface Actions<S, R> extends ActionTree<S, R> {
  register(context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateRequest)

  createCorporatePasswordIdentity(
    context: ActionContext<S, R>,
    request: CorporatesSchemas.CreateCorporatePasswordIdentity
  )

  createCorporatePassword(context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporatePassword)

  getCorporateDetails(context: ActionContext<S, R>, corporateId: number)

  getUsers(context: ActionContext<S, R>, corporateId: number)

  addUser(context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateUserFullRequest)

  checkKYB(context: ActionContext<S, R>)

  sendVerificationCodeEmail(context: ActionContext<S, R>, request: _Requests.sendVerificationEmailFull)
}

export module _Functions {
  export interface sendVerificationCodeEmail {
    (request: _Requests.sendVerificationEmailFull)
  }

  export interface addUser {
    (request: CorporatesSchemas.CreateCorporateUserFullRequest)
  }
}

export module _Requests {
  export interface sendVerificationEmailFull {
    body: SendEmailRequest
    corporateId: string
  }
}
