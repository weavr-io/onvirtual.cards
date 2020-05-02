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
      const _storeAuth = ctxt.store.getters['auth/auth']

      if (_storeAuth?.token !== auth?.token) {
        ctxt.store.commit('auth/AUTHENTICATE', auth, { root: true })
      }
    }
  } catch (err) {
    console.error(err)
    // No valid cookie found
  }
}
