import { Component, Vue } from 'nuxt-property-decorator'
import { $api } from '~/utils/api'
import { initialiseStores } from '~/utils/store-accessor'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'

const moment = require('moment')

@Component
export default class BaseMixin extends Vue {
  public isInvalid(item) {
    return item.$dirty ? !item.$error : null
  }

  public invalidFeedback(item, type, customMessage) {
    if (typeof customMessage !== 'undefined') {
      return customMessage
    }

    if (typeof type === 'undefined') {
      return 'Not Handled'
    } else {
      switch (type) {
        case 'required':
          return 'This is a required field.'
        case 'terms':
          return 'Please accept terms and conditions.'
        case 'email':
          return 'Please enter a valid email address.'
        case 'password':
          return 'Please enter a valid password - must be between 8 and 30 characters, and must include lowercase, uppercase, number and special characters.'
        case 'confirmPassword':
          return 'Confirmation password should be the same as password.'
        default:
          return 'Not Handled'
      }
    }
  }

  get stores() {
    return initialiseStores(this.$store)
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  downloadAsCSV(_accId, _pathParam, _req) {
    const req = $api.post('/app/api/' + _pathParam + '/' + _accId + '/statement/download', _req, {
      responseType: 'blob',
      headers: {
        Accept: '*/*'
      }
    })

    req.then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'statement_' + moment().format('YYYYMMDDHHmmss') + '.csv')
      document.body.appendChild(link)
      link.click()
    })
  }

  get isConsumer() {
    return this.stores.auth.isConsumer
  }

  get isCorporate() {
    return this.stores.auth.isCorporate
  }

  get isLoggedIn() {
    return this.stores.auth.isLoggedIn
  }

  get identityId() {
    return this.stores.auth.identityId
  }

  get consumer(): ConsumerModel | null {
    return this.stores.consumers.consumer
  }

  get rootName(): string {
    if (this.isConsumer) {
      return this.stores.consumers.consumer!.rootUser.name
    } else {
      // return this.stores.corporates.corporate!.rootUser.name
      return 'name'
    }
  }

  get rootSurname(): string {
    if (this.isConsumer) {
      return this.stores.consumers.consumer!.rootUser.surname
    } else {
      // return this.stores.corporates.corporate!.rootUser.name
      return 'surname'
    }
  }

  get rootFullName(): string {
    return `${this.rootName} ${this.rootSurname}`
  }

  get corporate() {
    return this.stores.corporates.corporate
  }

  logout() {
    return this.stores.auth.logout()
  }
}
