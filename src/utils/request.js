import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, getRefreshToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { isNotEmpty, isSuccess } from '@/utils/util'
import { refreshToken } from '@/api/login'   

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 20000
})
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.access_token) {
    const authorization = config.headers['Authorization']
    if (authorization === undefined || authorization.indexOf('Basic') === -1) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 请求失败，弹出提示信息
  if (!isSuccess(res.data)) {
    const { code, msg } = res.data
    const errMsg = errorCode[String(code)] || msg || errorCode['default']
    Message({ message: errMsg, type: 'error' })
  }
  return res
}, error => {
  if (error.code == 'ECONNABORTED') {
    Message({
      message: '系统繁忙，网络连接超时',
      type: 'error'
    })
    return Promise.reject(error)
  }
  if (error.response) {
    // 未设置状态码则默认成功状态
    const code = error.response.status || 200;
    // 获取错误信息
    const message = errorCode[code] || error.response.data.msg || errorCode['default']

    const originalRequest = error.config
    const currentRefreshToken = getRefreshToken()
    // 接口返回401并且已经重试过，自动刷新token
    if ((code === 401 || code === 403) && !originalRequest._retry && isNotEmpty(currentRefreshToken)) {
      console.log("拦截到了401请求")
      // 退出请求
      if (originalRequest.url.indexOf('removeToken') !== -1) {
        return
      }
      return refreshToken().then(response => {
        // 保存新的token
        setToken(response.data.access_token)
        store.commit('SET_ACCESS_TOKEN', response.data.access_token)
        // 带上新的token
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token
        // 去掉 /api 
        let url = originalRequest.url;
        originalRequest.url = url.substring(4)
        // 重新请求
        return axios(originalRequest)
      }).catch(() => {
        // 刷新失败，执行退出
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      })
    } else if (code === 400) {
      Message({
        message: message,
        type: 'error'
      })
    } else if (code === 404) {
      Message({
        message: message,
        type: 'error'
      })
    } else if (code === 500) {
      Message({
        message: message,
        type: 'error'
      })
    } else {
      Notification.error({
        title: message
      })
    }
  }
  return Promise.reject(error)
})

export default service
