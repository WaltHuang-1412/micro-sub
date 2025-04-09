import axios from 'axios'
import { HttpsStatusCode } from '@/models'
// import router, { routeList } from '@/router'
import { ElMessage, ElNotification } from 'element-plus'
import { isString, isObject } from 'lodash'
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
  ? `${process.env.VUE_APP_BASE_URL}/api/`
  : '/api/',
  timeout: 10000
})
// Add a request interceptor
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (config: any) {
    // Do something before request is sent
    // console.log('request config :>> ', config)
    const token = localStorage.getItem('access')
    if (isString(token) && isObject(config.headers)) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    // console.log('request error :>> ', error)
    return Promise.reject(error)
  }
)
// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    const { status, statusText } = response
    // console.log('response :>> ', response)
    switch (status) {
      case HttpsStatusCode.SuccessCreated:
        ElNotification({
          message: statusText,
          type: 'success'
        })
        break
      case HttpsStatusCode.SuccessNoContent:
        ElNotification({
          message: statusText,
          type: 'success'
        })
        break
      default:
        break
    }
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('response error :>> ', error)
    const { response } = error
    const { status, statusText, data } = response
    if (status >= HttpsStatusCode.ClientErrorBadRequest) {
      ElMessage({
        message: `${statusText} ${data}`,
        type: 'error'
      })
    }
    if (status === HttpsStatusCode.ClientErrorUnauthorized) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      // router.push({ name: routeList['log-in'] })
    }

    return Promise.reject(error)
  }
)
export default axiosInstance
