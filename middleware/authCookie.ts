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
        return ctxt.app.$weavrSecurityAssociate('Bearer ' + auth.token).then(
          () => {},
          (err) => {
            console.log(err)
          }
        )
      } else {
        return ctxt.app.$weavrSecurityAssociate(null)
      }
    }
  } catch (err) {
    console.error(err)
    return ctxt.app.$weavrSecurityAssociate(null)
    // No valid cookie found
  }
}
