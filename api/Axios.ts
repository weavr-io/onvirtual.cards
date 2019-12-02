import axios from 'axios'
import config from '~/config'

const baseURL = config.api.baseUrl

const api = axios.create({
  baseURL: baseURL
})

api.defaults.headers.common['Content-Type'] = 'application/json'
api.defaults.headers.common.Accept = 'application/json'

export { api, baseURL }
