import axios from 'axios'

const http = axios.create({
  ...(import.meta.env.VITE_API_BASE_LOCAL ? {} : { baseURL: import.meta.env.VITE_API_BASE_URL, headers: {'Accept': 'application/json'} }),
})

const createCancelToken = () => axios.CancelToken.source()
const isCancelThrown = (error) => axios.isCancel(error)

export { http, createCancelToken, isCancelThrown }
