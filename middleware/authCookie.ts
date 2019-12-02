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
      ctxt.store.commit('auth/AUTHENTICATE', auth, { root: true })
      if (auth != null) {
        return ctxt.app
          .$weavrSecurityAssociate('X-TOKEN ' + auth.token)
          .catch((err) => {
            console.log(err)
          })
      }
    }
  } catch (err) {
    console.error(err)
    // No valid cookie found
  }
}
