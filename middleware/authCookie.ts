import { authStore } from '~/utils/store-accessor'

const Cookie = process.client ? require('js-cookie') : undefined

export default function(ctxt) {
  let auth: authCookieContents | null = null

  interface authCookieContents {
    token: string
  }

  try {
    const authCookie = Cookie.get('auth-onvirtual')

    if (authCookie) {
      auth = JSON.parse(authCookie)
      const _storeAuth = authStore(ctxt.store).auth

      if (_storeAuth?.token !== auth?.token) {
        authStore(ctxt.store).AUTHENTICATE(auth as authCookieContents)
      }
    }
  } catch (err) {
    console.error(err)
    // No valid cookie found
  }
}
