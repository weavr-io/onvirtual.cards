const axios = require('axios')

export class AccessCodesApi {
  verifyAccessCode(code: number) {
    return axios.post('https://europe-west3-weavr-production-env.cloudfunctions.net/onvirtual-reg-code', code)
  }
}
