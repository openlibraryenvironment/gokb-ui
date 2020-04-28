import axios from 'axios'

const http = axios.create({
  ...(process.env.VUE_APP_API_BASE_LOCAL ? {} : { baseURL: process.env.VUE_APP_API_BASE_URL }),
})

const createCancelToken = () => axios.CancelToken.source()
const isCancelThrown = (error) => axios.isCancel(error)

export { http, createCancelToken, isCancelThrown }
