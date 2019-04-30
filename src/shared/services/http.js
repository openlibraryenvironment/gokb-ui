import axios from 'axios'
import utils from '@/shared/utils/utils'

axios.defaults.withCredentials = true

const http = axios.create({ baseURL: utils.getApiUrl() })

const createCancelToken = () => axios.CancelToken.source()
const isCancelThrown = (error) => axios.isCancel(error)

export { http, createCancelToken, isCancelThrown }
