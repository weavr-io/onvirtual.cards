import { Action, Module, Mutation } from 'vuex-module-decorators'
import { Schemas } from '~/api/Schemas'
import { $api } from '~/utils/api'
import { loaderStore } from '~/utils/store-accessor'
import { StoreModule } from '~/store/storeModule'
import LoginResult = Schemas.LoginResult

const Cookie = process.client ? require('js-cookie') : undefined

@Module({
  name: 'authModule',
  namespaced: true,
  stateFactory: true
})
export default class AuthModule extends StoreModule {
  auth: any = {}
  isLoading: boolean = false

  get isLoggedIn() {
    return this.auth != null && this.auth.token != null
  }

  get token() {
    return this.auth.token
  }

  get identityId() {
    return this.auth.identity ? this.auth.identity.id : null
  }

  get isConsumer() {
    return this.auth.identity ? this.auth.identity.type === 'consumers' : false
  }

  get isCorporate() {
    return this.auth.identity ? this.auth.identity.type === 'corporates' : false
  }

  get identity() {
    return this.auth.identity
  }

  @Mutation
  AUTHENTICATE(_res: LoginResult) {
    this.auth = _res
    Cookie.set('auth-onvirtual', this.auth)
    $api.defaults.headers.Authorization = 'Bearer ' + this.auth.token

    $weavrSetUserToken('Bearer ' + this.auth.token)
  }

  @Mutation
  LOGOUT() {
    this.auth = {}

    Cookie.remove('auth-onvirtual')

    delete $api.defaults.headers.Authorization
    delete $api.defaults.headers['X-Tenant']

    // @ts-ignore
    this.$weavrSetUserToken(null)
  }

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Action
  invalidateToken() {
    this.LOGOUT()
  }

  @Action
  authenticate(loginRequest: Schemas.LoginRequest) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post<LoginResult>('/app/api/auth/login_with_password', loginRequest)

    req.then((res) => {
      this.AUTHENTICATE(res.data)
      this.SET_IS_LOADING(false)
    })
    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  logout() {
    const xPromise = new Promise((resolve, reject) => {
      try {
        loaderStore(this.store).start()
        this.LOGOUT()
        resolve('ok')
      } catch (e) {
        reject(e)
      }
    })

    return xPromise
  }

  @Action
  verifyEmail(request: Schemas.verifyEmailRequest) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    let req

    if (request.consumerId) {
      req = $api.post('/app/api/consumers/' + request.consumerId + '/email/verify', request.request)
    } else {
      req = $api.post('/app/api/corporates/' + request.corporateId + '/users/email/verify', request.request)
    }

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  lostPasswordStart(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/lost_password/start', request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  lostPasswordValidate(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/lost_password/validate', request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  lostPasswordResume(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/lost_password/resume', request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  createPasswordIdentity(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/identities/' + request.id + '/create', request.request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  createPassword(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/' + request.id + '/create', request.request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  updatePassword(request: any) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/' + request.id + '/update', request.request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action
  validatePassword(request) {
    this.SET_IS_LOADING(true)
    loaderStore(this.store).start()

    const req = $api.post('/app/api/passwords/validate', request)

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }
}
