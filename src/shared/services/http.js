import axios from 'axios'

const http = axios.create()

const createCancelToken = () => axios.CancelToken.source()
const isCancelThrown = (error) => axios.isCancel(error)

export { http, createCancelToken, isCancelThrown }
