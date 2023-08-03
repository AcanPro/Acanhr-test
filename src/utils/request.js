import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use((config) => {
  // store.getters.token 每次请求需要authorithion
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// response interceptor
service.interceptors.response.use((response) => {
  // 判断接受二进制流
  if (response.data instanceof Blob) return response

  const { message, success } = response.data

  // json
  if (success) {
    return response
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, async err => {
  if (err.response?.status === 401) {
    await store.dispatch('user/loginOutAction')
    router.push('/login')
  }
  //
  Message.error(err.message)
  return Promise.reject(err)
}
)

export default service
